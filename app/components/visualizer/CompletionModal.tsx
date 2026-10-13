'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Map, Unlock } from 'lucide-react';
import { Dialog } from '@noirly-dev/ui';
import type { CompleteLessonResult } from '@/src/features/progress';
import { getTopic } from '@/app/data/curriculum';
import { lessonHref } from '@/app/data/lessonRoutes';

interface Props {
  open: boolean;
  result: CompleteLessonResult | null;
  onClose: () => void;
}

export default function CompletionModal({ open, result, onClose }: Props) {
  if (!result) return null;

  const topic = getTopic(result.lesson.track, result.lesson.level, result.lesson.category);
  const topicName = topic?.name ?? result.topicProgress.topicName;

  return (
    <Dialog open={open} title="Lesson complete" onClose={onClose} className="sm:max-w-md">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent">
            <CheckCircle2 size={20} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Completed</p>
            <p className="section-title truncate">{result.lesson.title}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div className="surface-flat p-3">
            <dt className="meta">Time</dt>
            <dd className="mt-1 font-mono text-fg">{result.lesson.time}</dd>
          </div>
          <div className="surface-flat p-3">
            <dt className="meta">Space</dt>
            <dd className="mt-1 font-mono text-fg">{result.lesson.space}</dd>
          </div>
        </dl>

        <div className="surface-flat p-4">
          <p className="meta">Topic progress</p>
          <p className="mt-1 text-sm text-fg">
            {topicName}{' '}
            <span className="font-mono text-accent">
              {result.topicProgress.completed} / {result.topicProgress.total}
            </span>{' '}
            completed
          </p>
        </div>

        {result.nextLesson && (
          <div className="flex items-center gap-3 rounded-[var(--r-lg)] bg-accent-soft p-4">
            <Unlock size={16} className="shrink-0 text-accent" aria-hidden />
            <div>
              <p className="meta">Unlocked</p>
              <p className="mt-0.5 font-semibold text-fg">{result.nextLesson.title}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          {result.nextLesson ? (
            <Link href={lessonHref(result.nextLesson.id)} className="btn btn-solid flex-1">
              Next lesson <ArrowRight size={14} aria-hidden />
            </Link>
          ) : (
            <button type="button" onClick={onClose} className="btn btn-solid flex-1">
              Done
            </button>
          )}
          <Link
            href={`/learn-path?track=${result.lesson.track}&level=${result.lesson.level}&topic=${result.lesson.category}`}
            className="btn btn-ghost flex-1"
          >
            <Map size={14} aria-hidden /> Roadmap
          </Link>
        </div>
      </div>
    </Dialog>
  );
}
