import { describe, expect, it } from 'vitest';
import { getAllLessons } from '@/app/data/curriculum';
import { getLessonQuiz, gradeQuiz, toPublicQuiz } from './bank';

describe('lesson quiz bank', () => {
  it('returns the same questions every time (ids are stable for grading)', () => {
    expect(getLessonQuiz('array-insert')).toEqual(getLessonQuiz('array-insert'));
  });

  it('uses the lesson’s own complexity, not the first lesson sharing its algorithm', () => {
    // pat-ll-middle and the Linked List lesson share linked-list-middle.
    const quiz = getLessonQuiz('pat-ll-middle')!;
    const timeQ = quiz.questions.find((q) => q.id.endsWith('-time'))!;
    expect(timeQ.options[timeQ.correctAnswer]).toBe('O(n)');
  });

  it('uses authored questions when a lesson has them', () => {
    const quiz = getLessonQuiz('array-reverse')!;
    expect(quiz.templated).toBe(false);
    expect(quiz.questions.length).toBeGreaterThanOrEqual(3);
  });

  it('never sends answers or explanations to the client', () => {
    const json = JSON.stringify(toPublicQuiz(getLessonQuiz('array-reverse')!));
    expect(json).not.toMatch(/correctAnswer|explanation/);
  });

  it('returns null for unknown lessons', () => {
    expect(getLessonQuiz('no-such-lesson')).toBeNull();
  });
});

describe('gradeQuiz', () => {
  const quiz = getLessonQuiz('array-reverse')!;
  const right = quiz.questions.map((q) => ({ questionId: q.id, choiceIndex: q.correctAnswer }));
  const wrong = quiz.questions.map((q) => ({ questionId: q.id, choiceIndex: (q.correctAnswer + 1) % q.options.length }));

  it('passes all-correct answers at 100%', () => {
    expect(gradeQuiz(quiz, right)).toMatchObject({ score: 100, passed: true, correct: quiz.questions.length });
  });

  it('fails below 70%', () => {
    const grade = gradeQuiz(quiz, [right[0], ...wrong.slice(1)]);
    expect(grade.passed).toBe(false);
    expect(grade.score).toBeLessThan(70);
  });

  it('counts unanswered, unknown and out-of-range answers as wrong', () => {
    const grade = gradeQuiz(quiz, [
      { questionId: 'made-up', choiceIndex: 0 },
      { questionId: quiz.questions[0].id, choiceIndex: 99 },
    ]);
    expect(grade.correct).toBe(0);
    expect(grade.passed).toBe(false);
  });

  it('cannot be gamed by answering the same question many times', () => {
    const spam = Array.from({ length: 10 }, () => right[0]);
    expect(gradeQuiz(quiz, spam).correct).toBe(1);
  });

  it('reveals the correct option and explanation only in the graded result', () => {
    const grade = gradeQuiz(quiz, wrong);
    expect(grade.results[0]).toMatchObject({ correct: false, correctIndex: quiz.questions[0].correctAnswer });
    expect(grade.results[0].explanation.length).toBeGreaterThan(0);
  });
});

describe('every lesson quiz', () => {
  const lessons = getAllLessons();

  it('is well formed: unique ids and options, answer in range', () => {
    for (const lesson of lessons) {
      const quiz = getLessonQuiz(lesson.id)!;
      expect(quiz.questions.length, lesson.id).toBeGreaterThanOrEqual(3);
      const ids = quiz.questions.map((q) => q.id);
      expect(new Set(ids).size, lesson.id).toBe(ids.length);
      for (const q of quiz.questions) {
        expect(new Set(q.options).size, `${lesson.id} ${q.id}`).toBe(q.options.length);
        expect(q.correctAnswer, `${lesson.id} ${q.id}`).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer, `${lesson.id} ${q.id}`).toBeLessThan(q.options.length);
      }
    }
  });

  it('asks about the lesson’s own run for most lessons (F2)', () => {
    const derived = lessons.filter((l) => getLessonQuiz(l.id)!.source === 'derived').length;
    expect(derived / lessons.length).toBeGreaterThan(0.7);
  });

  it('adds hand-written concept questions for high-traffic lessons', () => {
    const quiz = getLessonQuiz('sort-quick')!;
    expect(quiz.questions.some((q) => q.id === 'c-quick-worst')).toBe(true);
    expect(quiz.questions.some((q) => q.id.endsWith('-d-state'))).toBe(true);
  });
});
