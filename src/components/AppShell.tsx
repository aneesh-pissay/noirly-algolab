"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useSyncExternalStore, type ReactNode } from "react";
import {
  ChartColumn,
  Columns2,
  ExternalLink,
  FlaskConical,
  LayoutDashboard,
  LogIn,
  Search,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { AppShell as UIShell, Avatar, SidebarBrand } from "@noirly-dev/ui";
import { identityAccountUrl, useAuth } from "@/app/contexts/AuthContext";
import { tracks, type TrackId } from "@/app/data/curriculum";
import { BrandMark } from "@/src/components/BrandMark";
import { iconFor } from "@/src/components/Icon";
import { SignOutButton } from "@/src/components/SignOutButton";
import { ThemeControls } from "@/src/components/ThemeControls";
import { ShellBreadcrumbProvider, useShellCrumbs } from "@/src/components/ShellBreadcrumb";
import { useUIStore } from "@/src/stores/ui";
import { CommandPalette } from "@/src/features/command-palette/CommandPalette";

const noSubscribe = () => () => {};

function isApplePlatform() {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  return /mac|iphone|ipad/i.test(nav.userAgentData?.platform ?? nav.platform ?? "");
}

/** "⌘K" on Apple devices, "Ctrl K" elsewhere. The server render can't know, so it says Ctrl. */
function ShortcutLabel() {
  const apple = useSyncExternalStore(noSubscribe, isApplePlatform, () => false);
  return apple ? "⌘K" : "Ctrl K";
}

type NavEntry = {
  href: string;
  label: string;
  icon: LucideIcon;
  active: (pathname: string, track: string | null) => boolean;
};

const prefix = (base: string) => (pathname: string) => pathname === base || pathname.startsWith(`${base}/`);

const MAIN: NavEntry[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, active: (p) => p === "/dashboard" },
  { href: "/progress", label: "Progress", icon: ChartColumn, active: prefix("/progress") },
];

const LEARN: NavEntry[] = tracks.map((track) => ({
  href: `/learn-path?track=${track.id}`,
  label: track.title,
  icon: iconFor(track.id as TrackId),
  active: (p, t) => p === "/learn-path" && (t ?? "data-structures") === track.id,
}));

const EXPLORE: NavEntry[] = [
  { href: "/visual-lab", label: "Visual Lab", icon: FlaskConical, active: prefix("/visual-lab") },
  { href: "/compare", label: "Compare", icon: Columns2, active: prefix("/compare") },
  { href: "/settings", label: "Settings", icon: Settings, active: prefix("/settings") },
];

function NavGroup({ label, entries, onNavigate }: { label?: string; entries: NavEntry[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const track = useSearchParams().get("track");
  return (
    <nav aria-label={label ?? "Main"}>
      {label ? <p className="nav-group-label">{label}</p> : null}
      <div className="flex flex-col gap-0.5">
        {entries.map(({ href, label: text, icon: Glyph, active }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active(pathname, track) ? "page" : undefined}
            className="nav-item focusable"
          >
            <Glyph size={15} className="shrink-0 opacity-90" aria-hidden />
            <span className="min-w-0 flex-1 truncate">{text}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

function SidebarNav() {
  return (
    <div className="flex flex-col gap-5">
      <NavGroup entries={MAIN} />
      <NavGroup label="Learn path" entries={LEARN} />
      <NavGroup label="Explore" entries={EXPLORE} />
    </div>
  );
}

function SearchButton() {
  return (
    <button
      type="button"
      onClick={() => useUIStore.getState().setCommandPaletteOpen(true)}
      aria-keyshortcuts="Control+K Meta+K"
      className="focusable group flex w-full items-center justify-between rounded-xl border border-[var(--hairline)] bg-[var(--surface-2)] px-3 py-2 text-left text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
    >
      <span className="flex items-center gap-2">
        <Search size={14} aria-hidden />
        Search lessons
      </span>
      <kbd
        aria-hidden
        className="rounded-md border border-[var(--hairline)] px-1.5 py-0.5 font-mono text-[10px] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <ShortcutLabel />
      </kbd>
    </button>
  );
}

function AccountFooter() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) return <div className="h-16" aria-hidden />;

  if (!user) {
    return (
      <div className="space-y-2">
        <p className="text-xs text-[var(--text-secondary)]">Sign in to save progress and unlock quizzes.</p>
        <Link href={`/login?next=${encodeURIComponent(pathname)}`} className="btn btn-solid btn-sm w-full">
          <LogIn size={14} aria-hidden />
          Noirly Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5">
        <Avatar name={user.name} src={user.image ?? undefined} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm">{user.name}</p>
          <p className="truncate font-mono text-[11px] text-[var(--muted-foreground)]">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <a
          href={identityAccountUrl()}
          className="focusable flex items-center gap-2 rounded-[var(--r-sm)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--text)]"
        >
          <ExternalLink size={13} aria-hidden />
          Manage account
        </a>
        <SignOutButton />
      </div>
    </div>
  );
}

function ShellFrame({ children }: { children: ReactNode }) {
  const crumbs = useShellCrumbs();

  return (
    // Lenis smooth-scrolls only the document; the shell scrolls inside its own
    // content pane, so opt this subtree out (same as Noirly Flow).
    <div data-lenis-prevent className="contents">
      <UIShell
        className="h-dvh overflow-hidden"
        contentClassName="min-h-0 flex-1 overflow-y-auto"
        sidebar={{
          brand: (
            <Link href="/dashboard" className="focusable block rounded-[var(--r-sm)]" aria-label="Noirly AlgoLab dashboard">
              <SidebarBrand logo={<BrandMark className="h-5 w-5" name="" />} title="Noirly AlgoLab" subtitle="Visual DSA" />
            </Link>
          ),
          children: (
            <div className="space-y-5">
              <SearchButton />
              <Suspense fallback={null}>
                <SidebarNav />
              </Suspense>
            </div>
          ),
          footer: <AccountFooter />,
        }}
        header={{
          breadcrumb: crumbs ?? undefined,
          brand: <p className="font-display text-sm font-semibold tracking-tight">Noirly AlgoLab</p>,
          actions: <ThemeControls size="sm" />,
        }}
      >
        <div id="main" className="flex min-h-0 flex-1 flex-col">
          {children}
        </div>
      </UIShell>
      <CommandPalette />
    </div>
  );
}

/** Signed-in app chrome: sidebar (drawer on mobile), top bar, content pane. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ShellBreadcrumbProvider>
      <ShellFrame>{children}</ShellFrame>
    </ShellBreadcrumbProvider>
  );
}
