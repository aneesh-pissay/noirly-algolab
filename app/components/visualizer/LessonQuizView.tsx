'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Map as MapIcon, RotateCcw, XCircle } from 'lucide-react';
import type { LessonMeta } from '@/src/features/progress';
import { lessonHref } from '@/app/data/lessonRoutes';
import { getQuiz, submitQuiz, type PublicQuiz, type QuizGrade } from '@/src/services/quiz.service';
import { trackSave } from '@/src/stores/saving';

interface Props {
  lessonId: string;
  lessonName: string;
  alreadyCompleted: boolean;
  nextLesson: LessonMeta | null;
  learnPathHref: string | null;
  onPass: () => void;
  /** Saves completion; the server checks the graded attempt itself. */
  onComplete: () => void | Promise<void>;
  isCompleting: boolean;
}

/**
 * The lesson quiz. Questions arrive without answers; the server grades the
 * submission and only then returns the correct options and explanations.
 */
export default function LessonQuizView({
  lessonId,
  lessonName,
  alreadyCompleted,
  nextLesson,
  learnPathHref,
  onPass,
  onComplete,
  isCompleting,
}: Props) {
  const [quiz, setQuiz] = useState<PublicQuiz | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [grade, setGrade] = useState<QuizGrade | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [completedThisSession, setCompletedThisSession] = useState(false);

  useEffect(() => {
    let active = true;
    getQuiz(lessonId)
      .then((data) => {
        if (active) setQuiz(data);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Failed to load the quiz');
      });
    return () => {
      active = false;
    };
  }, [lessonId]);

  if (loadError) {
    return (
      <div role="alert" className="surface rounded-[var(--r-lg)] p-6 text-sm text-destructive">
        Could not load the quiz: {loadError}
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="surface flex h-48 items-center justify-center rounded-[var(--r-lg)]" role="status">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
        <span className="sr-only">Loading quiz</span>
      </div>
    );
  }

  const questions = quiz.questions;
  const lessonDone = alreadyCompleted || completedThisSession;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await trackSave(
        submitQuiz(
          lessonId,
          questions.filter((q) => answers[q.id] !== undefined).map((q) => ({ questionId: q.id, choiceIndex: answers[q.id] })),
        ),
      );
      setGrade(result);
      if (result.passed) onPass();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit the quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setGrade(null);
    setSubmitError(null);
  };

  const handleCompleteClick = async () => {
    await onComplete();
    setCompletedThisSession(true);
  };

  if (grade) {
    const results = new Map(grade.results.map((r) => [r.questionId, r]));
    return (
      <div className="surface flex h-full flex-col gap-6 overflow-auto rounded-[var(--r-lg)] p-6">
        <div className="text-center" role="status" aria-live="polite">
          <div
            className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${grade.passed ? 'bg-positive/15' : 'bg-destructive/15'}`}
          >
            {grade.passed ? (
              <CheckCircle2 size={34} className="text-positive" aria-hidden />
            ) : (
              <XCircle size={34} className="text-destructive" aria-hidden />
            )}
          </div>
          <h2 className="display-md">{grade.passed ? 'Quiz passed' : 'Keep practicing'}</h2>
          <p className="mt-1 text-fg-2">
            {grade.correct} / {grade.total} correct
          </p>
          <p className="matrix-numeral mt-3 text-4xl text-accent">{grade.score}%</p>
          <p className="mt-2 text-sm text-fg-2">
            {grade.passed
              ? lessonDone
                ? 'Lesson complete — continue to the next lesson or return to the roadmap.'
                : 'You passed. Complete the lesson to save your progress.'
              : `You need ${quiz.passScore}% to pass. Review the explanations and try again.`}
          </p>
        </div>

        <ol className="space-y-2">
          {questions.map((q, i) => {
            const r = results.get(q.id);
            const correct = Boolean(r?.correct);
            return (
              <li key={q.id} className="surface-flat px-4 py-3 text-sm">
                <p className="flex items-start gap-2 font-medium text-fg">
                  {correct ? (
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-positive" aria-label="Correct" />
                  ) : (
                    <XCircle size={15} className="mt-0.5 shrink-0 text-destructive" aria-label="Incorrect" />
                  )}
                  <span>
                    Q{i + 1}: {q.question}
                  </span>
                </p>
                {!correct && r ? <p className="mt-1 text-xs text-fg-2">Correct answer: {q.options[r.correctIndex]}</p> : null}
                {r?.explanation ? <p className="mt-1 text-xs text-fg-2">{r.explanation}</p> : null}
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col gap-3 sm:flex-row">
          {(!grade.passed || !lessonDone) && (
            <button type="button" onClick={handleRetry} className="btn btn-ghost flex-1">
              <RotateCcw size={14} aria-hidden /> Try again
            </button>
          )}
          {grade.passed && !lessonDone && (
            <button type="button" onClick={() => void handleCompleteClick()} disabled={isCompleting} className="btn btn-solid flex-1">
              {isCompleting ? 'Saving…' : 'Complete lesson'}
            </button>
          )}
          {grade.passed && lessonDone && nextLesson && (
            <Link href={lessonHref(nextLesson.id)} className="btn btn-solid flex-1">
              Next: {nextLesson.title} <ArrowRight size={14} aria-hidden />
            </Link>
          )}
          {grade.passed && lessonDone && learnPathHref && (
            <Link href={learnPathHref} className="btn btn-ghost flex-1">
              <MapIcon size={14} aria-hidden /> Roadmap
            </Link>
          )}
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];
  const selected = answers[current.id];
  const isLast = currentIndex === questions.length - 1;
  const answeredCount = questions.filter((q) => answers[q.id] !== undefined).length;

  return (
    <div className="surface flex h-full flex-col gap-4 overflow-auto rounded-[var(--r-lg)] p-6">
      <div>
        <h2 className="section-title">{lessonName} — quiz</h2>
        <p className="text-sm text-fg-2">
          Question {currentIndex + 1} of {questions.length} · pass with {quiz.passScore}%+
        </p>
        <div
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2"
          role="progressbar"
          aria-label="Questions answered"
          aria-valuemin={0}
          aria-valuemax={questions.length}
          aria-valuenow={answeredCount}
        >
          <div className="h-full bg-accent transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="mb-3 text-base font-semibold text-fg">{current.question}</legend>
        {current.options.map((option, index) => {
          const isSelected = selected === index;
          return (
            <label
              key={`${current.id}-${index}`}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-[var(--r-md)] border px-4 py-3 text-left text-sm transition focus-within:outline focus-within:outline-2 focus-within:outline-[var(--accent)] ${
                isSelected ? 'border-accent bg-accent-soft text-fg' : 'border-line text-fg hover:border-line-strong'
              }`}
            >
              <input
                type="radio"
                name={current.id}
                className="sr-only"
                checked={isSelected}
                onChange={() => setAnswers({ ...answers, [current.id]: index })}
              />
              <span
                aria-hidden
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-accent' : 'border-line-strong'}`}
              >
                {isSelected ? <span className="h-2 w-2 rounded-full bg-accent" /> : null}
              </span>
              {option}
            </label>
          );
        })}
      </fieldset>

      {submitError ? (
        <p role="alert" className="text-sm text-destructive">
          {submitError}
        </p>
      ) : null}

      <div className="mt-auto flex gap-3">
        <button
          type="button"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="btn btn-ghost btn-sm"
        >
          Previous
        </button>
        <div className="flex-1" />
        {isLast ? (
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={answeredCount < questions.length || submitting}
            className="btn btn-solid btn-sm"
          >
            {submitting ? 'Checking…' : 'Submit answers'}
          </button>
        ) : (
          <button type="button" onClick={() => setCurrentIndex(currentIndex + 1)} disabled={selected === undefined} className="btn btn-solid btn-sm">
            Next
          </button>
        )}
      </div>
    </div>
  );
}
