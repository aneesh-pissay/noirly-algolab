'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Map, XCircle } from 'lucide-react';
import type { QuizQuestion } from '@/app/data/lessonContent';
import type { LessonMeta } from '@/src/features/progress';

const PASS_SCORE = 70;

interface Props {
  lessonName: string;
  questions: QuizQuestion[];
  alreadyCompleted: boolean;
  nextLesson: LessonMeta | null;
  learnPathHref: string | null;
  onPass: () => void;
  onComplete: (quizScore: number) => void | Promise<void>;
  isCompleting: boolean;
}

export default function LessonQuizView({
  lessonName,
  questions,
  alreadyCompleted,
  nextLesson,
  learnPathHref,
  onPass,
  onComplete,
  isCompleting,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);
  const [completedThisSession, setCompletedThisSession] = useState(false);

  const current = questions[currentIndex];
  const selected = answers[currentIndex];
  const isAnswered = selected !== undefined;
  const isCorrect = isAnswered && selected === current.correctAnswer;

  const correctCount = Object.entries(answers).filter(
    ([i, a]) => a === questions[Number(i)].correctAnswer
  ).length;
  const score = Math.round((correctCount / questions.length) * 100);
  const passed = score >= PASS_SCORE;
  const lessonDone = alreadyCompleted || completedThisSession;

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    setAnswers({ ...answers, [currentIndex]: optionIndex });
  };

  const handleSubmit = () => setSubmitted(true);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSubmitted(false);
    } else {
      setShowResults(true);
      if (passed && !hasPassed) {
        setHasPassed(true);
        onPass();
      }
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    setShowResults(false);
    setHasPassed(false);
  };

  const handleCompleteClick = async () => {
    await onComplete(score);
    setCompletedThisSession(true);
  };

  if (showResults) {
    return (
      <div className="flex h-full flex-col gap-6 overflow-auto rounded-xl border border-line bg-surface p-6">
        <div className="text-center">
          <div
            className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 ${
              passed ? 'border-positive bg-positive/15' : 'border-destructive bg-destructive/15'
            }`}
          >
            {passed ? <CheckCircle2 size={40} className="text-positive" /> : <XCircle size={40} className="text-destructive" />}
          </div>
          <h2 className="text-2xl font-bold text-fg">{passed ? 'Quiz Passed!' : 'Keep Practicing'}</h2>
          <p className="mt-1 text-fg-2">
            {correctCount} / {questions.length} correct
          </p>
          <p className="mt-2 text-4xl font-bold text-accent">{score}%</p>
          <p className="mt-1 text-sm text-fg-2">
            {passed
              ? lessonDone
                ? 'Lesson complete — continue to the next lesson or return to the roadmap.'
                : 'You passed! Tap Complete Lesson to save your progress.'
              : `You need ${PASS_SCORE}% to pass. Try again.`}
          </p>
        </div>

        <div className="space-y-2">
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const correct = userAnswer === q.correctAnswer;
            return (
              <div
                key={q.id}
                className={`rounded-lg border px-4 py-3 text-sm ${
                  correct ? 'border-positive/30 bg-positive/10' : 'border-destructive/30 bg-destructive/10'
                }`}
              >
                <p className="font-medium text-fg">Q{i + 1}: {q.question}</p>
                {!correct && (
                  <p className="mt-1 text-xs text-fg-2">Correct: {q.options[q.correctAnswer]}</p>
                )}
                <p className="mt-1 text-xs text-fg-2">{q.explanation}</p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {!passed && (
            <button
              type="button"
              onClick={handleRetry}
              className="flex-1 cursor-pointer rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm font-medium text-fg transition hover:bg-surface-2"
            >
              Try Again
            </button>
          )}
          {passed && !lessonDone && (
            <>
              <button
                type="button"
                onClick={handleRetry}
                className="flex-1 cursor-pointer rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm font-medium text-fg transition hover:bg-surface-2"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={handleCompleteClick}
                disabled={isCompleting}
                className="flex-1 cursor-pointer rounded-lg border border-accent/40 bg-accent px-4 py-3 text-sm font-semibold text-accent-ink transition hover:bg-accent/90 disabled:opacity-50"
              >
                {isCompleting ? 'Saving...' : 'Complete Lesson'}
              </button>
            </>
          )}
          {passed && lessonDone && nextLesson && (
            <Link
              href={`/visualizer/${nextLesson.algorithmId}`}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-accent/40 bg-accent px-4 py-3 text-sm font-semibold text-accent-ink transition hover:bg-accent/90"
            >
              Next Lesson: {nextLesson.title} <ArrowRight size={14} />
            </Link>
          )}
          {passed && lessonDone && learnPathHref && (
            <Link
              href={learnPathHref}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border border-line bg-surface-2 px-4 py-3 text-sm font-medium text-fg transition hover:bg-surface-2"
            >
              <Map size={14} /> Back to Roadmap
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto rounded-xl border border-line bg-surface p-6">
      <div>
        <h2 className="text-lg font-bold text-fg">{lessonName} — Quiz</h2>
        <p className="text-sm text-fg-2">
          Question {currentIndex + 1} of {questions.length} · Pass with {PASS_SCORE}%+
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-accent transition-all"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h3 className="text-base font-semibold text-fg">{current.question}</h3>

      <div className="space-y-2">
        {current.options.map((option, index) => {
          const isSelected = selected === index;
          const showCorrect = submitted && index === current.correctAnswer;
          const showWrong = submitted && isSelected && !showCorrect;

          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(index)}
              disabled={submitted}
              className={`w-full cursor-pointer rounded-lg border-2 px-4 py-3 text-left text-sm transition ${
                showCorrect
                  ? 'border-positive bg-positive/10 text-positive'
                  : showWrong
                  ? 'border-destructive bg-destructive/10 text-destructive'
                  : isSelected
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-line bg-surface-2 text-fg hover:border-accent/40'
              } ${submitted ? 'cursor-default' : ''}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${isCorrect ? 'border-positive/30 bg-positive/10' : 'border-negative/30 bg-negative/5'}`}>
          <p className="font-medium text-fg">{isCorrect ? 'Correct!' : 'Explanation'}</p>
          <p className="mt-1 text-fg-2">{current.explanation}</p>
        </div>
      )}

      <div className="mt-auto flex gap-3">
        <button
          type="button"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="cursor-pointer rounded-lg border border-line px-4 py-2 text-sm text-fg disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <div className="flex-1" />
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isAnswered}
            className="cursor-pointer rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-ink disabled:opacity-40"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="cursor-pointer rounded-lg bg-accent px-5 py-2 text-sm font-medium text-accent-ink"
          >
            {currentIndex < questions.length - 1 ? 'Next' : 'See Results'}
          </button>
        )}
      </div>
    </div>
  );
}
