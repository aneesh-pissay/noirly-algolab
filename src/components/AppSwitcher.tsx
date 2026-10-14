"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, LayoutGrid } from "lucide-react";
import { noirlyApps } from "@/src/lib/ecosystem";

/** The other Noirly apps, one click away from the top bar (spec F10). */
export function AppSwitcher() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const apps = noirlyApps();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label="Noirly apps"
        className="focusable flex h-9 w-9 items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--text-secondary)] transition-colors hover:border-[var(--hairline-strong)] hover:text-[var(--text)]"
      >
        <LayoutGrid size={15} aria-hidden />
      </button>
      {open ? (
        <div
          id={menuId}
          className="surface absolute right-0 top-full z-40 mt-2 w-72 rounded-[var(--r-lg)] p-2 shadow-[var(--elev-2)]"
        >
          <p className="mono-label px-2 pb-2 pt-1">Noirly apps</p>
          <ul className="flex flex-col gap-0.5">
            <li className="flex items-center justify-between rounded-[var(--r-md)] bg-[var(--accent-soft)] px-3 py-2 text-sm">
              <span>Noirly AlgoLab</span>
              <span className="meta">here</span>
            </li>
            {apps.map((app) => (
              <li key={app.id}>
                <a
                  href={app.url}
                  className="focusable flex items-start justify-between gap-3 rounded-[var(--r-md)] px-3 py-2 text-sm transition-colors hover:bg-[var(--surface-2)]"
                >
                  <span className="min-w-0">
                    <span className="block">{app.name}</span>
                    <span className="block text-xs text-[var(--text-muted)]">{app.description}</span>
                  </span>
                  <ArrowUpRight size={14} className="mt-0.5 shrink-0 text-[var(--text-muted)]" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
