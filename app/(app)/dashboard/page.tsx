'use client';

import Link from 'next/link';
import { lessonHref } from '@/app/data/lessonRoutes';
import { useMemo } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Card, PageContainer, PageHeader, StatCell, StatGroup } from '@noirly-dev/ui';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  useProgressHydrated,
  useProgressData,
  getContinueLesson,
  getAllLessonMetas,
  getLessonMeta,
} from '@/src/features/progress';
import { getTopic as getCurriculumTopic, tracks } from '@/app/data/curriculum';

export default function DashboardPage() {
  const { user } = useAuth();
  const hydrated = useProgressHydrated();
  const progress = useProgressData();
  const { completedLessons, recentlyCompleted } = progress;

  const allLessons = getAllLessonMetas();
  // Ignore ids of lessons that were retired from the curriculum.
  const completedCount = completedLessons.filter((id) => getLessonMeta(id)).length;
  const overallProgress = allLessons.length ? Math.round((completedCount / allLessons.length) * 100) : 0;

  const continueLesson = useMemo(() => getContinueLesson(progress), [progress]);

  const recentLessons = useMemo(() => {
    return recentlyCompleted
      .map((id) => getLessonMeta(id))
      .filter(Boolean)
      .slice(0, 4);
  }, [recentlyCompleted]);

  const perTrack = useMemo(
    () =>
      tracks.map((track) => {
        const lessons = allLessons.filter((lesson) => lesson.track === track.id);
        const done = lessons.filter((lesson) => completedLessons.includes(lesson.id)).length;
        return { track, done, total: lessons.length };
      }),
    [allLessons, completedLessons],
  );

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center p-10" role="status">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
        <span className="sr-only">Loading your dashboard</span>
      </div>
    );
  }

  const continueTopic = continueLesson
    ? getCurriculumTopic(continueLesson.track, continueLesson.level, continueLesson.category)
    : null;
  const firstName = user?.name.split(' ')[0] || 'there';

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <PageHeader eyebrow="Dashboard" title={`Welcome back, ${firstName}`} lead="Your DSA learning command center." />

      {continueLesson && (
        <Card className="spotlight p-6">
          <p className="eyebrow">Continue learning</p>
          <h2 className="display-md mt-3">{continueLesson.title}</h2>
          <p className="mt-1 text-sm text-fg-2">
            {continueTopic?.name ?? continueLesson.category} · {continueLesson.track.replace('-', ' ')} · {continueLesson.level}
          </p>
          <Link href={lessonHref(continueLesson.id)} className="btn btn-solid mt-5">
            Resume lesson <ArrowRight size={14} aria-hidden />
          </Link>
        </Card>
      )}

      <StatGroup>
        <StatCell label="Completed" value={<span className="matrix-numeral">{completedCount}</span>} caption={`of ${allLessons.length} lessons`} />
        <StatCell label="Overall" value={<span className="matrix-numeral">{overallProgress}%</span>} caption="of the curriculum" />
        {perTrack.slice(0, 2).map(({ track, done, total }) => (
          <StatCell key={track.id} label={track.title} value={<span className="matrix-numeral">{done}</span>} caption={`of ${total}`} />
        ))}
      </StatGroup>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="text-fg-2" id="overall-progress-label">
            Overall progress
          </span>
          <span className="font-mono text-accent">{overallProgress}%</span>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-labelledby="overall-progress-label"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={overallProgress}
        >
          <div className="h-full bg-accent transition-all" style={{ width: `${overallProgress}%` }} />
        </div>
      </Card>

      {recentLessons.length > 0 && (
        <section className="space-y-3" aria-labelledby="recent-title">
          <h2 id="recent-title" className="section-title flex items-center gap-2">
            <Sparkles size={16} className="text-accent" aria-hidden /> Recently learned
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {recentLessons.map((lesson) =>
              lesson ? (
                <Link
                  key={lesson.id}
                  href={lessonHref(lesson.id)}
                  className="surface surface-interactive grain focusable block rounded-[var(--r-lg)] p-4"
                >
                  <p className="font-semibold text-fg">{lesson.title}</p>
                  <p className="meta mt-1">
                    {lesson.track.replace('-', ' ')} · {lesson.category}
                  </p>
                </Link>
              ) : null,
            )}
          </div>
        </section>
      )}

      <Link href="/learn-path" className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
        Browse the full learning path <ArrowRight size={14} aria-hidden />
      </Link>
    </PageContainer>
  );
}
