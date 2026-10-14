'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarClock, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { Card } from '@noirly-dev/ui';
import { lessonHref } from '@/app/data/lessonRoutes';
import { answerReview, getReview, type ReviewAnswerResult } from '@/src/services/review.service';

const REVIEW_KEY = ['review'] as const;

function relativeDays(iso: string): string {
  const days = Math.max(1, Math.round((new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
  return days === 1 ? 'tomorrow' : `in ${days} days`;
}

/** Dashboard card for spaced review of missed quiz questions (spec F8). */
export default function ReviewCard() {
  const queryClient = useQueryClient();
  const review = useQuery({ queryKey: REVIEW_KEY, queryFn: getReview });
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<(ReviewAnswerResult & { chosen: number }) | null>(null);
  const answer = useMutation({ mutationFn: answerReview });

  if (review.isLoading || review.isError || !review.data || review.data.total === 0) return null;

  const { due, dueCount, nextDueAt } = review.data;
  const current = due[index];

  const choose = (choiceIndex: number) => {
    if (!current || result || answer.isPending) return;
    answer.mutate(
      { lessonId: current.lessonId, questionId: current.questionId, choiceIndex },
      { onSuccess: (data) => setResult({ ...data, chosen: choiceIndex }) },
    );
  };

  const next = () => {
    setResult(null);
    if (index + 1 < due.length) setIndex(index + 1);
    else {
      setIndex(0);
      void queryClient.invalidateQueries({ queryKey: REVIEW_KEY });
    }
  };

  return (
    <Card className="p-5">
      <section aria-labelledby="review-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="review-title" className="section-title flex items-center gap-2">
          <RotateCcw size={16} className="text-accent" aria-hidden /> Review
        </h2>
        <span className="meta">{dueCount > 0 ? `${dueCount} due` : nextDueAt ? `next ${relativeDays(nextDueAt)}` : ''}</span>
      </div>

      {!current ? (
        <p className="flex items-center gap-2 text-sm text-fg-2">
          <CalendarClock size={15} aria-hidden /> Nothing to review right now.
          {nextDueAt ? ` Missed questions come back ${relativeDays(nextDueAt)}.` : ''}
        </p>
      ) : (
        <div className="space-y-3">
          <p className="meta">
            From{' '}
            <Link href={lessonHref(current.lessonId)} className="underline-offset-4 hover:underline">
              {current.lessonName}
            </Link>{' '}
            · {index + 1} of {due.length}
          </p>
          <p className="text-sm font-semibold text-fg">{current.question}</p>
          <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Answers">
            {current.options.map((option, i) => {
              const isRight = result && i === result.correctIndex;
              const isWrong = result && i === result.chosen && !result.correct;
              return (
                <button
                  key={`${current.questionId}-${i}`}
                  type="button"
                  disabled={Boolean(result) || answer.isPending}
                  onClick={() => choose(i)}
                  className={`focusable flex items-center gap-2 rounded-[var(--r-md)] border px-3 py-2 text-left text-sm transition ${
                    isRight ? 'border-positive bg-positive/10' : isWrong ? 'border-destructive bg-destructive/10' : 'border-line hover:border-line-strong'
                  }`}
                >
                  {isRight ? <CheckCircle2 size={14} className="shrink-0 text-positive" aria-label="Correct answer" /> : null}
                  {isWrong ? <XCircle size={14} className="shrink-0 text-destructive" aria-label="Your answer" /> : null}
                  {option}
                </button>
              );
            })}
          </div>
          {answer.isError ? <p role="alert" className="text-sm text-destructive">{answer.error.message}</p> : null}
          {result ? (
            <div role="status" aria-live="polite" className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-fg-2">
                <span className={result.correct ? 'text-positive' : 'text-destructive'}>{result.correct ? 'Right.' : 'Not quite.'}</span>{' '}
                {result.explanation}{' '}
                {result.nextDueAt ? `Back ${relativeDays(result.nextDueAt)}.` : 'Retired from review.'}
              </p>
              <button type="button" onClick={next} className="btn btn-solid btn-sm">
                {index + 1 < due.length ? 'Next question' : 'Done'}
              </button>
            </div>
          ) : null}
        </div>
      )}
      </section>
    </Card>
  );
}
