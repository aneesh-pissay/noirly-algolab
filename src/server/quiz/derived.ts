/**
 * Quiz questions derived from a lesson's own example run (spec F2): what the
 * data looks like after a step, which operation comes next, how the run
 * ends — plus one conceptual question. Unlike the old templated fallback
 * ("what is the main goal of …"), these can only be answered by following
 * the visualization.
 *
 * Everything is deterministic: the same lesson always produces the same
 * questions, ids and option order, which grading relies on.
 */
import type { AlgorithmAction, AlgorithmStep } from '@/src/core/engine/types';
import type { ChallengeQuestion } from './challenges';
import { ACTION_LABELS } from '@/app/lib/actionLabels';

/** Keys whose value is "the data" of a step, in order of preference. */
const PRIMARY_KEYS = ['array', 'nums', 'values', 'stack', 'queue', 'deque', 'sorted', 'merged', 'heap', 'inorder', 'list', 'dist', 'result', 'string'];

const KEY_NAMES: Record<string, string> = {
  array: 'array',
  nums: 'array',
  values: 'array',
  stack: 'stack',
  queue: 'queue',
  deque: 'deque',
  sorted: 'sorted output',
  merged: 'merged output',
  heap: 'heap',
  inorder: 'in-order list',
  list: 'list',
  dist: 'distance table',
  result: 'result',
  string: 'string',
};

const FALLBACK_ACTIONS: AlgorithmAction[] = ['compare', 'swap', 'move-pointer', 'place', 'found', 'push', 'pop'];

type Primitive = number | string | boolean | null;

function seededShuffle<T>(items: T[], seed: string): T[] {
  const arr = [...items];
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i++) hash = Math.imul(hash ^ seed.charCodeAt(i), 16777619) >>> 0;
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (Math.imul(hash, 1664525) + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function primaryKey(steps: AlgorithmStep[]): string | null {
  for (const key of PRIMARY_KEYS) {
    const values = steps.map((s) => s.visualizationData?.[key]);
    const usable = values.filter((v) => Array.isArray(v) && v.length > 0 && v.length <= 16 && v.every((x) => x === null || ['number', 'string', 'boolean'].includes(typeof x)));
    if (usable.length >= Math.max(2, Math.ceil(steps.length / 2))) return key;
  }
  return null;
}

function format(list: Primitive[]): string {
  return `[${list.map((x) => (x === null ? '∅' : typeof x === 'string' ? `'${x}'` : String(x))).join(', ')}]`;
}

function stateAt(steps: AlgorithmStep[], key: string, index: number): Primitive[] | null {
  const value = steps[index]?.visualizationData?.[key];
  return Array.isArray(value) ? (value as Primitive[]) : null;
}

/** Up to four distinct options with the correct one included; null if fewer than three. */
function options(correct: string, candidates: string[], seed: string): { options: string[]; correctAnswer: number } | null {
  const distinct = [correct, ...candidates.filter((c) => c !== correct)].filter((c, i, all) => all.indexOf(c) === i).slice(0, 4);
  if (distinct.length < 3) return null;
  const shuffled = seededShuffle(distinct, seed);
  return { options: shuffled, correctAnswer: shuffled.indexOf(correct) };
}

function clip(text: string, max = 110): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function stateQuestion(lessonId: string, steps: AlgorithmStep[], key: string, run: string): ChallengeQuestion | null {
  const name = KEY_NAMES[key] ?? key;
  // First change at or after a third of the run, so it is not the trivial opening.
  const start = Math.max(1, Math.floor(steps.length / 3));
  for (let k = start; k < steps.length; k += 1) {
    const before = stateAt(steps, key, k - 1);
    const after = stateAt(steps, key, k);
    if (!before || !after) continue;
    const correct = format(after);
    if (correct === format(before)) continue;
    const later = steps.slice(k + 1).map((_, i) => stateAt(steps, key, k + 1 + i)).find((s) => s && format(s) !== correct);
    const perturbed = after.length > 1 ? [...after].reverse() : null;
    const built = options(correct, [format(before), ...(later ? [format(later)] : []), ...(perturbed ? [format(perturbed)] : [])], `${lessonId}:state`);
    if (!built) continue;
    return {
      id: `${lessonId}-d-state`,
      question: `${run}, a step reads: “${clip(steps[k - 1].description)}”. What does the ${name} look like after the next step?`,
      ...built,
      explanation: `Step ${k + 1} — ${steps[k].description} — leaves the ${name} as ${correct}.`,
    };
  }
  return null;
}

function nextActionQuestion(lessonId: string, steps: AlgorithmStep[], run: string): ChallengeQuestion | null {
  const label = (a: AlgorithmAction) => ACTION_LABELS[a];
  const used = [...new Set(steps.map((s) => s.action))].filter((a) => label(a));
  if (used.length < 2) return null;
  // A step whose successor does something different from it.
  const start = Math.max(0, Math.floor(steps.length / 4));
  for (let k = start; k < steps.length - 1; k += 1) {
    const next = steps[k + 1].action;
    if (!label(next) || next === steps[k].action) continue;
    const pool = [...used, ...FALLBACK_ACTIONS].filter((a) => a !== next && label(a));
    const built = options(label(next)!, pool.map((a) => label(a)!), `${lessonId}:next`);
    if (!built) continue;
    return {
      id: `${lessonId}-d-next`,
      question: `${run}, the algorithm has just done: “${clip(steps[k].description)}”. What does it do next?`,
      ...built,
      explanation: `Next it does: ${steps[k + 1].description}`,
    };
  }
  return null;
}

/** A numeric variable (index, pointer, sum) the learner can track step by step. */
function variableQuestion(lessonId: string, steps: AlgorithmStep[], run: string): ChallengeQuestion | null {
  const names = new Map<string, Set<number>>();
  for (const step of steps) {
    for (const [name, value] of Object.entries(step.variables ?? {})) {
      if (typeof value !== 'number' || !Number.isFinite(value)) continue;
      if (!names.has(name)) names.set(name, new Set());
      names.get(name)!.add(value);
    }
  }
  const candidates = [...names].filter(([, values]) => values.size >= 3).map(([name]) => name).sort();
  const start = Math.max(1, Math.floor(steps.length / 3));
  for (const name of candidates) {
    for (let k = start; k < steps.length; k += 1) {
      const before = steps[k - 1].variables?.[name];
      const after = steps[k].variables?.[name];
      if (typeof before !== 'number' || typeof after !== 'number' || before === after) continue;
      const seen = [...names.get(name)!].filter((v) => v !== after).sort((a, b) => Math.abs(a - after) - Math.abs(b - after));
      const built = options(String(after), [String(before), ...seen.map(String)], `${lessonId}:var`);
      if (!built) continue;
      return {
        id: `${lessonId}-d-var`,
        question: `${run}, the algorithm has just done: “${clip(steps[k - 1].description)}”. What is ${name} after the next step?`,
        ...built,
        explanation: `${steps[k].description} — so ${name} becomes ${after}.`,
      };
    }
  }
  return null;
}

function outcomeQuestion(lessonId: string, steps: AlgorithmStep[], key: string | null, run: string): ChallengeQuestion | null {
  const last = steps[steps.length - 1];
  if (key) {
    const final = stateAt(steps, key, steps.length - 1);
    const first = stateAt(steps, key, 0);
    if (final && first && format(final) !== format(first)) {
      const name = KEY_NAMES[key] ?? key;
      const mid = stateAt(steps, key, Math.floor(steps.length / 2));
      const sortedFinal = [...final].sort((a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))));
      const built = options(format(final), [format(first), ...(mid ? [format(mid)] : []), format([...final].reverse()), format(sortedFinal)], `${lessonId}:out`);
      if (built) {
        return {
          id: `${lessonId}-d-output`,
          question: `${run}, the ${name} starts as ${format(first)}. What is it when the run finishes?`,
          ...built,
          explanation: `The run ends with: ${last.description}`,
        };
      }
    }
  }
  // The data does not change (searches, checks): ask how the run ends.
  const others = steps
    .slice(1, -1)
    .map((s) => clip(s.description))
    .filter((d, i, all) => all.indexOf(d) === i);
  const picks = seededShuffle(others, `${lessonId}:outpool`).slice(0, 3);
  const built = options(clip(last.description), picks, `${lessonId}:out`);
  if (!built) return null;
  return {
    id: `${lessonId}-d-output`,
    question: `${run}, which of these is the last step?`,
    ...built,
    explanation: `The last step is: ${last.description}`,
  };
}

function complexityQuestion(lessonId: string, name: string, time: string): ChallengeQuestion {
  const pool = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'].filter((t) => t !== time);
  const built = options(time, seededShuffle(pool, `${lessonId}:tpool`).slice(0, 3), `${lessonId}:time`)!;
  return {
    id: `${lessonId}-d-time`,
    question: `What is the time complexity of ${name}?`,
    ...built,
    explanation: `${name} runs in ${time} time.`,
  };
}

/**
 * Questions from the lesson's example run. Returns null when the run does not
 * support at least two step-based questions; the caller then falls back.
 */
export function deriveQuestions(
  lessonId: string,
  name: string,
  time: string,
  steps: AlgorithmStep[],
  /** Set when the questions use an input other than the lesson's example. */
  inputNote: string | null = null,
): ChallengeQuestion[] | null {
  if (steps.length < 3) return null;
  const run = inputNote ? `Running it on ${inputNote}` : 'In the lesson’s example run';
  const key = primaryKey(steps);
  const state = key ? stateQuestion(lessonId, steps, key, run) : null;
  const derived = [state, state ? null : variableQuestion(lessonId, steps, run), nextActionQuestion(lessonId, steps, run), outcomeQuestion(lessonId, steps, key, run)].filter(
    (q): q is ChallengeQuestion => q !== null,
  );
  if (derived.length < 2) return null;
  return [...derived.slice(0, 3), complexityQuestion(lessonId, name, time)];
}
