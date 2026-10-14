'use client';

import { CheckCircle2, XCircle } from 'lucide-react';
import type { Prediction } from '@/app/lib/predict';

interface Props {
  prediction: Prediction;
  chosen: number | null;
  onChoose: (index: number) => void;
  onContinue: () => void;
}

/** One "what happens next?" question in predict mode (spec F3). */
export default function PredictPanel({ prediction, chosen, onChoose, onContinue }: Props) {
  const answered = chosen !== null;
  const correct = chosen === prediction.correctIndex;

  return (
    <section aria-label="Predict the next step" className="surface rounded-[var(--r-lg)] p-4">
      <p className="mono-label mb-2">Predict</p>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-fg">{prediction.question}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {prediction.options.map((option, index) => {
            const isRight = answered && index === prediction.correctIndex;
            const isWrong = answered && index === chosen && !correct;
            return (
              <button
                key={`${index}-${option}`}
                type="button"
                disabled={answered}
                onClick={() => onChoose(index)}
                aria-pressed={chosen === index}
                className={`focusable flex items-center gap-2 rounded-[var(--r-md)] border px-3 py-2 text-left font-mono text-xs transition ${
                  isRight
                    ? 'border-positive bg-positive/10 text-fg'
                    : isWrong
                    ? 'border-destructive bg-destructive/10 text-fg'
                    : 'border-line text-fg hover:border-line-strong disabled:opacity-60'
                }`}
              >
                {isRight ? <CheckCircle2 size={14} className="shrink-0 text-positive" aria-label="Correct answer" /> : null}
                {isWrong ? <XCircle size={14} className="shrink-0 text-destructive" aria-label="Your answer" /> : null}
                <span>{option}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      {answered ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3" role="status" aria-live="polite">
          <p className="text-sm text-fg">
            <span className={correct ? 'text-positive' : 'text-destructive'}>{correct ? 'Right.' : 'Not quite.'}</span>{' '}
            <span className="text-fg-2">{prediction.explanation}</span>
          </p>
          <button type="button" className="btn btn-solid btn-sm" onClick={onContinue} autoFocus>
            Show the step
          </button>
        </div>
      ) : null}
    </section>
  );
}
