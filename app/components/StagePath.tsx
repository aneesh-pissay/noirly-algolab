'use client';

import Link from 'next/link';
import { CheckCircle2, Lock } from 'lucide-react';
import { levels, tracks, type Level } from '@/app/data/curriculum';
import { iconFor } from '@/src/components/Icon';
import { CORE_DIFFICULTIES, getStageProgress, isStageUnlocked, isTopicUnlocked, type UserProgress } from '@/src/features/progress';

function topicCore(done: Set<string>, lessons: Record<string, { id: string }[]>) {
  const core = CORE_DIFFICULTIES.flatMap((d) => lessons[d] ?? []);
  return { done: core.filter((l) => done.has(l.id)).length, total: core.length };
}

/**
 * The whole curriculum as one path: the Beginner stage across every track,
 * then Intermediate, then Advanced. A stage opens once the core (Easy and
 * Medium lessons) of every topic in the stage before it is done.
 */
export default function StagePath({ progress }: { progress: UserProgress }) {
  const done = new Set(progress.completedLessons);
  const stages = levels.map((level, index) => {
    const { done: coreDone, total } = getStageProgress(level, progress.completedLessons);
    const unlocked = isStageUnlocked(level, progress);
    return { level, index, coreDone, total, unlocked, complete: total > 0 && coreDone === total };
  });
  const current = stages.find((s) => s.unlocked && !s.complete) ?? stages[stages.length - 1];

  return (
    <section aria-labelledby="stage-path-title" className="space-y-4">
      <div>
        <h2 id="stage-path-title" className="section-title">
          Your path
        </h2>
        <p className="mt-1 text-sm text-fg-2">
          Beginner topics of every track first, then Intermediate, then Advanced. Each topic&apos;s Easy and Medium lessons are its core;
          Hard lessons are optional challenges.
        </p>
      </div>
      <ol className="space-y-4">
        {stages.map((stage) => (
          <StageCard key={stage.level} stage={stage} isCurrent={stage.level === current.level} done={done} progress={progress} />
        ))}
      </ol>
    </section>
  );
}

function StageCard({
  stage,
  isCurrent,
  done,
  progress,
}: {
  stage: { level: Level; index: number; coreDone: number; total: number; unlocked: boolean; complete: boolean };
  isCurrent: boolean;
  done: Set<string>;
  progress: UserProgress;
}) {
  const percent = stage.total ? Math.round((stage.coreDone / stage.total) * 100) : 0;
  const previous = levels[stage.index - 1];
  const status = stage.complete ? 'Core complete' : stage.unlocked ? (isCurrent ? 'Current stage' : 'Open') : `Unlocks after ${previous}`;

  return (
    <li
      aria-label={`Stage ${stage.index + 1}: ${stage.level}`}
      className={`surface grain rounded-[var(--r-lg)] p-5 ${isCurrent ? 'shadow-[inset_0_0_0_1px_var(--accent)]' : ''} ${stage.unlocked ? '' : 'opacity-70'}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="matrix-numeral flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-sm text-accent" aria-hidden>
            {stage.index + 1}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-fg">{stage.level}</h3>
            <p className="meta">{status}</p>
          </div>
        </div>
        <span className="font-mono text-xs text-fg-2">
          {stage.coreDone}/{stage.total} core lessons
        </span>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-label={`${stage.level} core progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className="h-full bg-accent transition-all" style={{ width: `${percent}%` }} />
      </div>
      {!stage.unlocked ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-fg-2">
          <Lock size={13} aria-hidden /> Finish the {previous} core in all three tracks to open this stage.
        </p>
      ) : null}
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {tracks.map((track) => {
          const Glyph = iconFor(track.id);
          const topics = track.topics[stage.level] ?? [];
          return (
            <div key={track.id}>
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-fg-2">
                <Glyph size={13} aria-hidden /> {track.title}
              </p>
              <ul className="flex flex-col gap-1.5">
                {topics.map((topic) => {
                  const core = topicCore(done, topic.lessons);
                  const open = isTopicUnlocked(track.id, stage.level, topic.id, progress) || core.done > 0;
                  const finished = core.total > 0 && core.done === core.total;
                  const body = (
                    <>
                      <span className="min-w-0 flex-1 truncate">{topic.name}</span>
                      {finished ? (
                        <CheckCircle2 size={14} className="shrink-0 text-positive" aria-label="Core complete" />
                      ) : open ? (
                        <span className="shrink-0 font-mono text-[11px] text-fg-3">
                          {core.done}/{core.total}
                        </span>
                      ) : (
                        <Lock size={12} className="shrink-0 text-fg-3" aria-label="Locked" />
                      )}
                    </>
                  );
                  const rowClass = 'flex items-center gap-2 rounded-[var(--r-md)] border border-line px-3 py-2 text-sm';
                  return (
                    <li key={topic.id}>
                      {open ? (
                        <Link
                          href={`/learn-path?track=${track.id}&level=${stage.level}&topic=${topic.id}`}
                          className={`${rowClass} focusable text-fg transition-colors hover:border-line-strong hover:bg-surface-2`}
                        >
                          {body}
                        </Link>
                      ) : (
                        <div className={`${rowClass} text-fg-3`}>{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </li>
  );
}
