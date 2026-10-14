/**
 * The quiz for each lesson, and grading. Server-only: questions go to the
 * client without `correctAnswer`, and answers are checked here.
 */
import type { Algorithm } from '@/src/core/engine/types';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { bootstrapVisualizerEngine } from '@/app/lib/engineBootstrap';
import { findLessonById } from '@/app/data/curriculum';
import { resolveTheoryKey } from '@/app/data/lessonTheory';
import { algorithmChallenges, conceptQuestions, type ChallengeQuestion } from './challenges';
import { deriveQuestions } from './derived';
import { detectInputSpec, tryRun, worstCaseInput, type LessonInput } from '@/app/lib/lessonInput';

export type QuizQuestion = ChallengeQuestion;

export interface PublicQuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface LessonQuiz {
  lessonId: string;
  questions: QuizQuestion[];
  /** Generic complexity questions, not about this lesson's run (spec B7): no XP. */
  templated: boolean;
  /** Where the questions came from. */
  source: 'authored' | 'derived' | 'templated';
}

export const PASS_SCORE = 70;

function shuffleWithSeed<T>(items: T[], seed: string): T[] {
  const arr = [...items];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function lessonAlgorithm(algorithmId: string): Algorithm | undefined {
  bootstrapVisualizerEngine();
  return visualizerEngine.getAlgorithm(algorithmId);
}

/** Deterministic: the same lesson always yields the same questions in the same order. */
function templatedQuestions(lessonId: string, name: string, time: string, space: string, algorithm?: Algorithm): QuizQuestion[] {
  const description = algorithm?.description ?? 'process data efficiently';
  const category = (algorithm?.category ?? 'data-structure').replace('-', ' ');
  const wrongTimes = shuffleWithSeed(['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'].filter((t) => t !== time), lessonId + 't');
  const wrongSpaces = shuffleWithSeed(['O(1)', 'O(n)', 'O(n²)', 'O(log n)'].filter((s) => s !== space), lessonId + 's');
  const correctDesc = description.charAt(0).toUpperCase() + description.slice(1);

  const timeOptions = shuffleWithSeed([time, wrongTimes[0], wrongTimes[1], wrongTimes[2]], lessonId + '1');
  const spaceOptions = shuffleWithSeed([space, wrongSpaces[0], wrongSpaces[1], wrongSpaces[2]], lessonId + '2');
  const goalOptions = shuffleWithSeed(
    [correctDesc, `Sort elements using only ${category} brute-force comparisons`, 'Allocate maximum memory for caching', 'Skip input validation entirely'],
    lessonId + '3',
  );

  return [
    {
      id: `${lessonId}-q-time`,
      question: `What is the time complexity of ${name}?`,
      options: timeOptions,
      correctAnswer: timeOptions.indexOf(time),
      explanation: `${name} runs in ${time} time based on the algorithm's design and input size.`,
    },
    {
      id: `${lessonId}-q-space`,
      question: `What is the space complexity of ${name}?`,
      options: spaceOptions,
      correctAnswer: spaceOptions.indexOf(space),
      explanation: `${name} requires ${space} auxiliary space.`,
    },
    {
      id: `${lessonId}-q-concept`,
      question: `What best describes the main goal of ${name}?`,
      options: goalOptions,
      correctAnswer: goalOptions.indexOf(correctDesc),
      explanation: `The core purpose is: ${description}`,
    },
  ];
}

function describeInput(input: LessonInput): string {
  const parts: string[] = [];
  if (input.array) parts.push(`the array [${input.array.join(', ')}]`);
  if (input.target !== undefined) parts.push(`target ${input.target}`);
  if (input.k !== undefined) parts.push(`k = ${input.k}`);
  if (input.str) parts.push(`"${input.str}"`);
  if (input.text) parts.push(`the text "${input.text}"`);
  if (input.pattern) parts.push(`pattern "${input.pattern}"`);
  if (input.edges) parts.push(`the edges ${input.edges.map(([u, v]) => `${u}-${v}`).join(', ')}`);
  return parts.join(', ');
}

export function getLessonQuiz(lessonId: string): LessonQuiz | null {
  const ctx = findLessonById(lessonId);
  if (!ctx) return null;
  const { algorithmId } = ctx.lesson;
  const authored = algorithmChallenges[resolveTheoryKey(algorithmId)] ?? algorithmChallenges[algorithmId];
  if (authored && authored.length >= 3) return { lessonId, questions: authored, templated: false, source: 'authored' };

  const algorithm = lessonAlgorithm(algorithmId);
  let steps: ReturnType<Algorithm['generateSteps']> = [];
  try {
    steps = algorithm?.generateSteps({}) ?? [];
  } catch {
    steps = [];
  }
  // A very short example (a search that hits on the first probe) gives little
  // to ask about: use the lesson's worst-case input instead, and name it so
  // learners can reproduce it with the custom input panel.
  let inputNote: string | null = null;
  if (algorithm && steps.length < 6) {
    const spec = detectInputSpec(algorithmId, algorithm);
    const input = spec ? worstCaseInput(spec) : null;
    const longer = input ? tryRun(algorithm, input) : null;
    if (input && longer && longer.length > steps.length && longer.length <= 80) {
      steps = longer;
      inputNote = describeInput(input);
    }
  }
  const derived = deriveQuestions(lessonId, ctx.lesson.name, ctx.lesson.time, steps, inputNote);
  const concepts = conceptQuestions[algorithmId] ?? [];
  if (derived) return { lessonId, questions: [...derived, ...concepts].slice(0, 6), templated: false, source: 'derived' };
  if (concepts.length >= 2) {
    const fallback = templatedQuestions(lessonId, ctx.lesson.name, ctx.lesson.time, ctx.lesson.space, algorithm).slice(0, 2);
    return { lessonId, questions: [...concepts, ...fallback], templated: false, source: 'authored' };
  }

  return {
    lessonId,
    questions: templatedQuestions(lessonId, ctx.lesson.name, ctx.lesson.time, ctx.lesson.space, algorithm),
    templated: true,
    source: 'templated',
  };
}

/** What the browser gets: no correct answers, no explanations. */
export function toPublicQuiz(quiz: LessonQuiz) {
  return {
    lessonId: quiz.lessonId,
    templated: quiz.templated,
    passScore: PASS_SCORE,
    questions: quiz.questions.map(({ id, question, options }): PublicQuizQuestion => ({ id, question, options })),
  };
}

export interface QuizAnswer {
  questionId: string;
  choiceIndex: number;
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  chosenIndex: number | null;
  correctIndex: number;
  explanation: string;
}

export interface QuizGrade {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  results: QuizResult[];
}

/** Unanswered or unknown questions count as wrong; for a repeated id the last answer wins. */
export function gradeQuiz(quiz: LessonQuiz, answers: QuizAnswer[]): QuizGrade {
  const chosen = new Map<string, number>();
  for (const answer of answers) chosen.set(answer.questionId, answer.choiceIndex);

  const results = quiz.questions.map((q): QuizResult => {
    const pick = chosen.get(q.id);
    const chosenIndex = typeof pick === 'number' && Number.isInteger(pick) && pick >= 0 && pick < q.options.length ? pick : null;
    return { questionId: q.id, correct: chosenIndex === q.correctAnswer, chosenIndex, correctIndex: q.correctAnswer, explanation: q.explanation };
  });
  const correct = results.filter((r) => r.correct).length;
  const total = quiz.questions.length;
  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { score, passed: score >= PASS_SCORE, correct, total, results };
}
