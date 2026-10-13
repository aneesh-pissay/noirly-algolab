"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getAllLessonMetas, getContinueLesson, useProgressData } from "@/src/features/progress";
import { tracks } from "@/app/data/curriculum";
import { getTopic } from "@/app/data/curriculum";
import { allVisualLabs } from "@/app/data/visualLabs";
import { lessonHref } from "@/app/data/lessonRoutes";
import { useUIStore } from "@/src/stores/ui";

const itemClass =
  "flex cursor-pointer items-center justify-between gap-3 rounded-[var(--r-sm)] px-3 py-2 text-sm text-[var(--foreground)] data-[selected=true]:bg-[var(--accent-soft)] data-[selected=true]:text-[var(--text)]";
const headingClass =
  "mb-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.16em] [&_[cmdk-group-heading]]:text-[var(--muted-foreground)]";

const PAGES = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/progress", label: "Progress" },
  { href: "/visual-lab", label: "Visual Lab" },
  { href: "/settings", label: "Settings" },
  ...tracks.map((track) => ({ href: `/learn-path?track=${track.id}`, label: `Learn path · ${track.title}` })),
];

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return el?.tagName === "INPUT" || el?.tagName === "TEXTAREA" || el?.tagName === "SELECT" || Boolean(el?.isContentEditable);
}

/** Cmd/Ctrl+K (or `/`): jump to any lesson, demo or page. Pure client search. */
export function CommandPalette() {
  const router = useRouter();
  const open = useUIStore((state) => state.commandPaletteOpen);
  const setOpen = useUIStore((state) => state.setCommandPaletteOpen);
  const progress = useProgressData();
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!useUIStore.getState().commandPaletteOpen);
        return;
      }
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setOpen]);

  const lessons = useMemo(
    () =>
      getAllLessonMetas().map((lesson) => {
        const topic = getTopic(lesson.track, lesson.level, lesson.category);
        const trackTitle = tracks.find((t) => t.id === lesson.track)?.title ?? lesson.track;
        return { lesson, topicName: topic?.name ?? lesson.category, trackTitle };
      }),
    [],
  );
  const continueLesson = useMemo(() => getContinueLesson(progress), [progress]);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery("");
      }}
      label="Search lessons and pages"
      overlayClassName="fixed inset-0 z-50 bg-[var(--bg)]/60 backdrop-blur-sm"
      contentClassName="fixed left-1/2 top-[12vh] z-50 w-[min(38rem,calc(100%-2rem))] -translate-x-1/2 overflow-hidden rounded-[var(--r-lg)] border border-[var(--hairline)] bg-[var(--surface)] shadow-[var(--elev-3)]"
    >
      <Command.Input
        value={query}
        onValueChange={setQuery}
        placeholder="Search 300+ lessons, demos and pages…"
        className="h-12 w-full border-b border-[var(--hairline)] bg-transparent px-4 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
      />
      <Command.List data-lenis-prevent className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-6 text-center text-sm text-[var(--muted-foreground)]">No results.</Command.Empty>

        {continueLesson ? (
          <Command.Group heading="Continue" className={headingClass}>
            <Command.Item
              value={`continue where I left off ${continueLesson.title}`}
              onSelect={() => go(lessonHref(continueLesson.id))}
              className={itemClass}
            >
              <span>Continue where you left off</span>
              <span className="truncate font-mono text-[11px] text-[var(--muted-foreground)]">{continueLesson.title}</span>
            </Command.Item>
          </Command.Group>
        ) : null}

        <Command.Group heading="Go to" className={headingClass}>
          {PAGES.map((page) => (
            <Command.Item key={page.href} value={`page ${page.label}`} onSelect={() => go(page.href)} className={itemClass}>
              {page.label}
            </Command.Item>
          ))}
        </Command.Group>

        {query.trim().length > 0 ? (
          <>
            <Command.Group heading="Lessons" className={headingClass}>
              {lessons.map(({ lesson, topicName, trackTitle }) => (
                <Command.Item
                  key={lesson.id}
                  value={`${lesson.title} ${topicName} ${trackTitle} ${lesson.difficulty} ${lesson.id}`}
                  onSelect={() => go(lessonHref(lesson.id))}
                  className={itemClass}
                >
                  <span className="truncate">{lesson.title}</span>
                  <span className="shrink-0 font-mono text-[11px] text-[var(--muted-foreground)]">
                    {topicName} · {lesson.difficulty}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Visual Lab" className={headingClass}>
              {allVisualLabs.map((lab) => (
                <Command.Item
                  key={lab.slug}
                  value={`visual lab demo ${lab.title}`}
                  onSelect={() => go(`/visual-lab/${lab.slug}`)}
                  className={itemClass}
                >
                  {lab.title}
                </Command.Item>
              ))}
            </Command.Group>
          </>
        ) : null}
      </Command.List>
    </Command.Dialog>
  );
}
