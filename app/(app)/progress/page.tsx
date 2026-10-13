'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, EmptyState, PageContainer, PageHeader, StatCell, StatGroup } from '@noirly-dev/ui';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { levels, tracks } from '@/app/data/curriculum';
import { iconFor } from '@/src/components/Icon';
import {
  getAllLessonMetas,
  getContinueLesson,
  getLessonMeta,
  useProgressData,
  useProgressHydrated,
} from '@/src/features/progress';

function Bar({ value, label }: { value: number; label: string }) {
  return (
    <div
      className="h-1.5 overflow-hidden rounded-full bg-surface-2"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <div className="h-full bg-accent transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function ProgressPage() {
  const hydrated = useProgressHydrated();
  const progress = useProgressData();
  const all = getAllLessonMetas();
  const completed = useMemo(() => new Set(progress.completedLessons), [progress.completedLessons]);
  const continueLesson = useMemo(() => getContinueLesson(progress), [progress]);

  const breakdown = useMemo(
    () =>
      tracks.map((track) => {
        const rows = levels.map((level) => {
          const lessons = all.filter((l) => l.track === track.id && l.level === level);
          const done = lessons.filter((l) => completed.has(l.id)).length;
          return { level, done, total: lessons.length };
        });
        const done = rows.reduce((n, r) => n + r.done, 0);
        const total = rows.reduce((n, r) => n + r.total, 0);
        return { track, rows, done, total };
      }),
    [all, completed],
  );

  const topicsStarted = useMemo(() => {
    const topics = new Set<string>();
    for (const id of progress.completedLessons) {
      const meta = getLessonMeta(id);
      if (meta) topics.add(`${meta.track}:${meta.category}`);
    }
    return topics.size;
  }, [progress.completedLessons]);

  const recent = progress.recentlyCompleted.map((id) => getLessonMeta(id)).filter(Boolean).slice(0, 8);

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-10" role="status">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
        <span className="sr-only">Loading progress</span>
      </div>
    );
  }

  const pct = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0);

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Progress' }]} />
      <PageHeader eyebrow="Progress" title="Learning progress" lead="Lesson completion across every track and level." />

      <StatGroup>
        <StatCell label="Lessons completed" value={<span className="matrix-numeral">{completed.size}</span>} caption={`of ${all.length}`} />
        <StatCell label="Topics started" value={<span className="matrix-numeral">{topicsStarted}</span>} />
        <StatCell label="Overall" value={<span className="matrix-numeral">{pct(completed.size, all.length)}%</span>} />
        <StatCell label="Up next" value={<span className="text-base">{continueLesson?.title ?? '—'}</span>} />
      </StatGroup>

      <div className="grid gap-5 lg:grid-cols-3">
        {breakdown.map(({ track, rows, done, total }) => {
          const Glyph = iconFor(track.id);
          return (
            <Card key={track.id} className="p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[var(--r-md)] bg-accent-soft text-accent">
                  <Glyph size={17} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h2 className="section-title truncate">{track.title}</h2>
                  <p className="meta">
                    {done} / {total} lessons
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-4">
                {rows.map((row) => (
                  <li key={row.level} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <Link href={`/learn-path?track=${track.id}&level=${row.level}`} className="text-fg-2 hover:text-fg">
                        {row.level}
                      </Link>
                      <span className="font-mono text-xs text-fg-2">
                        {row.done}/{row.total}
                      </span>
                    </div>
                    <Bar value={pct(row.done, row.total)} label={`${track.title} ${row.level}`} />
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <section aria-labelledby="recent-title" className="space-y-3">
        <h2 id="recent-title" className="section-title">
          Recently completed
        </h2>
        {recent.length === 0 ? (
          <EmptyState
            title="Nothing completed yet"
            description="Finish a lesson's quiz to see it here."
            action={
              <Link href="/learn-path" className="btn btn-ghost btn-sm">
                Open the learning path
              </Link>
            }
          />
        ) : (
          <ul className="surface-flat divide-y divide-line">
            {recent.map((lesson) =>
              lesson ? (
                <li key={lesson.id} className="flex items-center gap-3 px-4 py-3">
                  <CheckCircle2 size={15} className="shrink-0 text-positive" aria-label="Completed" />
                  <Link href={`/visualizer/${lesson.algorithmId}`} className="min-w-0 flex-1 truncate text-sm hover:text-accent">
                    {lesson.title}
                  </Link>
                  <span className="meta hidden sm:inline">
                    {lesson.category} · {lesson.difficulty}
                  </span>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </section>
    </PageContainer>
  );
}
