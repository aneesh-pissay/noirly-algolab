'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';
import {
  useProgressHydrated,
  useProgressData,
  getContinueLesson,
  getAllLessonMetas,
  getLessonMeta,
} from '@/src/features/progress';
import { getTopic as getCurriculumTopic } from '../data/curriculum';

export default function DashboardPage() {
  const { user } = useAuth();
  const hydrated = useProgressHydrated();
  const progress = useProgressData();
  const { completedLessons, recentlyCompleted } = progress;

  const allLessons = getAllLessonMetas();
  const completedCount = completedLessons.length;
  const overallProgress = allLessons.length
    ? Math.round((completedCount / allLessons.length) * 100)
    : 0;

  const continueLesson = useMemo(() => getContinueLesson(progress), [progress]);

  const recentLessons = useMemo(() => {
    return recentlyCompleted
      .map((id) => getLessonMeta(id))
      .filter(Boolean)
      .slice(0, 4);
  }, [recentlyCompleted]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const continueTopic = continueLesson
    ? getCurriculumTopic(continueLesson.track, continueLesson.level, continueLesson.category)
    : null;

  return (
    <>
      <Sidebar />
      <Header />

      <main className="app-main">
        <div className="mx-auto max-w-[1200px] space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
          <Breadcrumbs items={[{ label: 'Dashboard' }]} />

          <section className="space-y-2">
            <h1 className="font-display text-2xl font-extrabold text-on-surface sm:text-3xl lg:text-4xl">
              Welcome back, <span className="text-primary">{user?.name.split(' ')[0] || 'Coder'}</span>
            </h1>
            <p className="text-on-surface-variant">Your DSA learning command center.</p>
          </section>

          {continueLesson && (
            <section className="accent-card rounded-2xl p-6">
              <p className="text-xs uppercase tracking-widest text-primary">Continue Learning</p>
              <h2 className="mt-2 text-2xl font-bold text-on-surface">
                Continue {continueLesson.title}
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {continueTopic?.name ?? continueLesson.category} · {continueLesson.track.replace('-', ' ')}
              </p>
              <Link
                href={`/visualizer/${continueLesson.algorithmId}`}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/15 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/25"
              >
                Resume Lesson <ArrowRight size={14} />
              </Link>
            </section>
          )}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="cursor-pointer rounded-xl border border-outline-variant/30 bg-surface-container p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-on-surface-variant">
                <BookOpen size={14} /> Completed
              </div>
              <p className="mt-2 font-display text-3xl text-primary">{completedCount}</p>
              <p className="mt-1 text-xs text-on-surface-variant">of {allLessons.length} lessons</p>
            </div>
            <div className="cursor-pointer rounded-xl border border-outline-variant/30 bg-surface-container p-5">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-on-surface-variant">
                Overall Progress
              </div>
              <p className="mt-2 font-display text-3xl text-primary">{overallProgress}%</p>
              <p className="mt-1 text-xs text-on-surface-variant">across the full curriculum</p>
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant/30 bg-surface-container p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-on-surface-variant">Overall Progress</span>
              <span className="font-mono text-primary">{overallProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </section>

          {recentLessons.length > 0 && (
            <section className="space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-on-surface">
                <Sparkles size={16} className="text-primary" /> Recently Learned
              </h2>
              <div className="grid gap-3 md:grid-cols-2">
                {recentLessons.map((lesson) =>
                  lesson ? (
                    <Link
                      key={lesson.id}
                      href={`/visualizer/${lesson.algorithmId}`}
                      className="cursor-pointer rounded-xl border border-outline-variant/30 bg-surface-container p-4 transition hover:border-primary/30"
                    >
                      <p className="font-semibold text-on-surface">{lesson.title}</p>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {lesson.track.replace('-', ' ')} · {lesson.category}
                      </p>
                    </Link>
                  ) : null
                )}
              </div>
            </section>
          )}

          <section>
            <Link
              href="/learn-path"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
            >
              Browse full learning path <ArrowRight size={14} />
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}
