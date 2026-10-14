'use client';

import { useRef, type KeyboardEvent } from 'react';
import { BookOpen, CheckCircle2, HelpCircle, Lock, PlayCircle } from 'lucide-react';

export type LessonStep = 'visualize' | 'theory' | 'quiz';

interface StepState {
  visualize: boolean;
  theory: boolean;
  quiz: boolean;
}

interface Props {
  active: LessonStep;
  completed: StepState;
  onStepClick: (step: LessonStep) => void;
}

export const LESSON_STEPS: { id: LessonStep; label: string; icon: typeof PlayCircle; shortcut: string }[] = [
  { id: 'theory', label: 'Theory', icon: BookOpen, shortcut: '1' },
  { id: 'visualize', label: 'Visualize', icon: PlayCircle, shortcut: '2' },
  { id: 'quiz', label: 'Quiz', icon: HelpCircle, shortcut: '3' },
];

/**
 * Steps unlock in order: theory → visualize → quiz. The quiz opens once the
 * visualization has been stepped to its final frame (or the lesson is
 * already completed), and the server re-checks completion independently.
 */
export function canAccessStep(step: LessonStep, completed: StepState): boolean {
  return step === 'theory' || (step === 'visualize' && completed.theory) || (step === 'quiz' && completed.theory && completed.visualize);
}

export default function LessonStepBar({ active, completed, onStepClick }: Props) {
  const refs = useRef<Record<LessonStep, HTMLButtonElement | null>>({ theory: null, visualize: null, quiz: null });

  // Arrow keys move between tabs (WAI-ARIA tabs pattern), skipping locked ones.
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const open = LESSON_STEPS.filter((s) => canAccessStep(s.id, completed));
    const index = open.findIndex((s) => s.id === active);
    const next = open[(index + (event.key === 'ArrowRight' ? 1 : -1) + open.length) % open.length];
    if (next) {
      onStepClick(next.id);
      refs.current[next.id]?.focus();
    }
  };

  return (
    <div role="tablist" aria-label="Lesson steps" onKeyDown={onKeyDown} className="tab-list flex flex-wrap items-center gap-1">
      {LESSON_STEPS.map((step) => {
        const Glyph = step.icon;
        const isActive = active === step.id;
        const isDone = completed[step.id];
        const canAccess = canAccessStep(step.id, completed);

        return (
          <button
            key={step.id}
            ref={(el) => {
              refs.current[step.id] = el;
            }}
            type="button"
            role="tab"
            id={`lesson-tab-${step.id}`}
            aria-selected={isActive}
            aria-controls={`lesson-panel-${step.id}`}
            aria-disabled={!canAccess}
            aria-keyshortcuts={step.shortcut}
            tabIndex={isActive ? 0 : -1}
            onClick={() => canAccess && onStepClick(step.id)}
            className={`tab focusable inline-flex items-center gap-2 ${canAccess ? '' : 'cursor-not-allowed opacity-50'}`}
          >
            {isDone ? (
              <CheckCircle2 size={15} className="text-positive" aria-hidden />
            ) : canAccess ? (
              <Glyph size={15} aria-hidden />
            ) : (
              <Lock size={13} aria-hidden />
            )}
            {step.label}
            {isDone ? <span className="sr-only">(done)</span> : null}
            {!canAccess ? <span className="sr-only">(locked)</span> : null}
          </button>
        );
      })}
    </div>
  );
}
