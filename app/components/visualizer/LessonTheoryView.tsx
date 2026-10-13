'use client';

import type { ReactNode } from 'react';
import { ArrowRight, BookOpen, Lightbulb, Target, ThumbsDown, ThumbsUp, Zap } from 'lucide-react';
import type { LessonTheory } from '@/app/data/lessonContent';

interface Props {
  theory: LessonTheory;
  lessonName: string;
  onContinue: () => void;
  theoryViewed: boolean;
}

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <h3 className="text-xs font-semibold uppercase tracking-widest text-accent">{title}</h3>
      </div>
      {children}
    </div>
  );
}

export default function LessonTheoryView({ theory, lessonName, onContinue, theoryViewed }: Props) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-auto">
      <div className="rounded-xl border border-accent/30 bg-accent/10 px-5 py-4">
        <div className="flex items-center gap-2 text-accent">
          <BookOpen size={18} />
          <h2 className="text-lg font-bold text-fg">{lessonName} — Theory</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-fg-2">{theory.overview}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="How It Works" icon={<Target size={14} className="text-accent" />}>
          <ol className="space-y-2">
            {theory.howItWorks.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm text-fg-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Key Points" icon={<Lightbulb size={14} className="text-negative" />}>
          <ul className="space-y-2">
            {theory.keyPoints.map((point) => (
              <li key={point} className="flex gap-2 text-sm text-fg-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {point}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Real-World Uses" icon={<Zap size={14} className="text-accent" />}>
          <ul className="space-y-2">
            {theory.useCases.map((use) => (
              <li key={use} className="flex gap-2 text-sm text-fg-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-negative" />
                {use}
              </li>
            ))}
          </ul>
        </Section>

        <div className="grid gap-4 sm:grid-cols-2">
          <Section title="Pros" icon={<ThumbsUp size={14} className="text-positive" />}>
            <ul className="space-y-1.5">
              {theory.pros.map((p) => (
                <li key={p} className="text-sm text-fg-2">+ {p}</li>
              ))}
            </ul>
          </Section>
          <Section title="Cons" icon={<ThumbsDown size={14} className="text-negative" />}>
            <ul className="space-y-1.5">
              {theory.cons.map((c) => (
                <li key={c} className="text-sm text-fg-2">− {c}</li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between rounded-xl border border-line bg-surface-2 px-5 py-4">
        <p className="text-sm text-fg-2">
          {theoryViewed ? 'Theory reviewed — proceed to the visualizer.' : 'Read through the theory, then continue.'}
        </p>
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-accent/40 bg-accent/15 px-4 py-2 text-sm font-medium text-accent transition hover:bg-accent/25"
        >
          Continue to Visualize <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
