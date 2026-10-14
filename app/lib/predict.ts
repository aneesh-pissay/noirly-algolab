/**
 * Predict-the-next-step mode (spec F3): before each step the learner picks
 * what happens next, then the step is revealed and explained.
 */
import type { AlgorithmAction, AlgorithmStep } from '@/src/core/engine/types';
import { ACTION_LABELS } from './actionLabels';

export interface Prediction {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DATA_KEYS = ['array', 'nums', 'values', 'stack', 'queue', 'deque', 'sorted', 'merged', 'heap', 'list'];
const FALLBACK: AlgorithmAction[] = ['compare', 'swap', 'move-pointer', 'place', 'found', 'push', 'pop', 'visit'];

function shuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let h = seed >>> 0 || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    const j = h % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function listOf(step: AlgorithmStep | undefined): { key: string; list: unknown[] } | null {
  for (const key of DATA_KEYS) {
    const value = step?.visualizationData?.[key];
    if (Array.isArray(value) && value.length <= 16 && value.every((x) => x === null || ['number', 'string'].includes(typeof x))) return { key, list: value };
  }
  return null;
}

const fmt = (list: unknown[]) => `[${list.map((x) => (x === null ? '∅' : String(x))).join(', ')}]`;

function finish(correct: string, distractors: string[], seed: number, question: string, explanation: string): Prediction | null {
  const options = [correct, ...distractors.filter((d) => d !== correct)].filter((o, i, all) => all.indexOf(o) === i).slice(0, 4);
  if (options.length < 3) return null;
  const shuffled = shuffle(options, seed);
  return { question, options: shuffled, correctIndex: shuffled.indexOf(correct), explanation };
}

/** A question about step `index + 1`, asked while `index` is on screen. */
export function buildPrediction(steps: AlgorithmStep[], index: number): Prediction | null {
  const now = steps[index];
  const next = steps[index + 1];
  if (!now || !next) return null;
  const explanation = next.description;

  const before = listOf(now);
  const after = listOf(next);
  if (before && after && before.key === after.key && fmt(before.list) !== fmt(after.list)) {
    const later = steps.slice(index + 2).map(listOf).find((s) => s && s.key === after.key && fmt(s.list) !== fmt(after.list));
    return finish(
      fmt(after.list),
      [fmt(before.list), ...(later ? [fmt(later.list)] : []), fmt([...after.list].reverse())],
      index * 7919 + steps.length,
      `What will the ${after.key} look like after the next step?`,
      explanation,
    );
  }

  const label = ACTION_LABELS[next.action];
  if (!label) return null;
  const used = [...new Set(steps.map((s) => s.action))];
  const pool = [...used, ...FALLBACK].filter((a) => a !== next.action && ACTION_LABELS[a]).map((a) => ACTION_LABELS[a]!);
  return finish(label, shuffle(pool, index + 31), index * 104729 + steps.length, 'What does the algorithm do next?', explanation);
}
