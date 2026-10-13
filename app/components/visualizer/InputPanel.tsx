'use client';

import { useId, useState, type FormEvent } from 'react';
import { Dices, Link2, RotateCcw, Play, TrendingDown } from 'lucide-react';
import { LIMITS, parseDraft, randomInput, toDraft, worstCaseInput, type InputDraft, type InputField, type InputSpec, type LessonInput } from '@/app/lib/lessonInput';

interface Props {
  spec: InputSpec;
  /** The input currently visualized (null = the lesson's example). */
  current: LessonInput | null;
  error: string | null;
  onRun: (input: LessonInput | null) => void;
  onShare: () => void;
  shareStatus: string | null;
}

const LABELS: Record<InputField, { label: string; placeholder: string; hint?: string }> = {
  array: { label: 'Array', placeholder: '5, 3, 8, 1, 9', hint: `Up to ${LIMITS.arrayLength} whole numbers, ±${LIMITS.numberAbs}` },
  target: { label: 'Target', placeholder: '8' },
  k: { label: 'k', placeholder: '3' },
  str: { label: 'String', placeholder: 'racecar', hint: `Up to ${LIMITS.stringLength} characters` },
  text: { label: 'Text', placeholder: 'cbaebabacd', hint: `Up to ${LIMITS.stringLength} characters` },
  pattern: { label: 'Pattern', placeholder: 'abc' },
  edges: { label: 'Edges', placeholder: '0-1, 0-2, 1-3:4', hint: `u-v or u-v:weight · vertices 0–${LIMITS.vertex}` },
};

/** Lets learners run the visualization on their own input (spec F1). */
export default function InputPanel({ spec, current, error, onRun, onShare, shareStatus }: Props) {
  const [draft, setDraft] = useState<InputDraft>(() => (current ? toDraft(current) : {}));
  const [parseError, setParseError] = useState<string | null>(null);
  const formId = useId();

  const run = (input: LessonInput) => {
    setDraft(toDraft(input));
    setParseError(null);
    onRun(input);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const result = parseDraft(draft, spec);
    if (!result.ok) {
      setParseError(result.error);
      return;
    }
    if (Object.keys(result.input).length === 0) {
      setParseError('Enter a value, or use Random or Worst case.');
      return;
    }
    run(result.input);
  };

  const message = parseError ?? error;

  return (
    <form onSubmit={onSubmit} className="surface rounded-[var(--r-lg)] p-4" aria-label="Custom input">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="mono-label">Input</p>
        <p className="meta">{current ? 'Your input' : 'Lesson example'}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {spec.fields.map((field) => {
          const meta = LABELS[field];
          const id = `${formId}-${field}`;
          return (
            <div key={field} className={field === 'array' || field === 'edges' || field === 'text' ? 'sm:col-span-2' : ''}>
              <label htmlFor={id} className="mb-1 block text-xs text-fg-2">
                {meta.label}
                {field === 'array' && spec.sortedArray ? <span className="text-fg-3"> · sorted automatically</span> : null}
              </label>
              <input
                id={id}
                value={draft[field] ?? ''}
                onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                placeholder={meta.placeholder}
                inputMode={field === 'target' || field === 'k' ? 'numeric' : undefined}
                autoComplete="off"
                spellCheck={false}
                aria-describedby={meta.hint ? `${id}-hint` : undefined}
                className="w-full rounded-[var(--r-md)] border border-line bg-bg px-3 py-2 font-mono text-sm text-fg outline-none placeholder:text-fg-3 focus-visible:border-accent"
              />
              {meta.hint ? (
                <p id={`${id}-hint`} className="mt-1 text-[11px] text-fg-3">
                  {meta.hint}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      {message ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {message}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="submit" className="btn btn-solid btn-sm">
          <Play size={13} aria-hidden /> Run
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => run(randomInput(spec))}>
          <Dices size={13} aria-hidden /> Random
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => run(worstCaseInput(spec))}>
          <TrendingDown size={13} aria-hidden /> Worst case
        </button>
        {current ? (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setDraft({});
              setParseError(null);
              onRun(null);
            }}
          >
            <RotateCcw size={13} aria-hidden /> Example
          </button>
        ) : null}
        <span className="flex-1" />
        <button type="button" className="btn btn-ghost btn-sm" onClick={onShare}>
          <Link2 size={13} aria-hidden /> Share this step
        </button>
      </div>
      <p role="status" aria-live="polite" className="mt-2 min-h-4 text-xs text-fg-2">
        {shareStatus}
      </p>
    </form>
  );
}
