/**
 * Compare mode (spec F7): two algorithms, the same input, side by side.
 * Only algorithms that take the same kind of input are paired.
 */
import type { AlgorithmAction, AlgorithmStep } from '@/src/core/engine/types';
import type { InputSpec } from './lessonInput';

export interface CompareGroup {
  id: string;
  title: string;
  algorithms: { id: string; name: string }[];
  /** Default pair. */
  pair: [string, string];
  spec: InputSpec;
  example: { array?: number[]; target?: number; edges?: [number, number][] };
}

export const COMPARE_GROUPS: CompareGroup[] = [
  {
    id: 'sorting',
    title: 'Sorting',
    algorithms: [
      { id: 'sorting-bubble', name: 'Bubble Sort' },
      { id: 'sorting-selection', name: 'Selection Sort' },
      { id: 'sorting-insertion', name: 'Insertion Sort' },
      { id: 'sorting-merge', name: 'Merge Sort' },
      { id: 'sorting-quick', name: 'Quick Sort' },
      { id: 'sorting-heap', name: 'Heap Sort' },
      { id: 'sorting-shell', name: 'Shell Sort' },
      { id: 'sorting-counting', name: 'Counting Sort' },
      { id: 'sorting-radix', name: 'Radix Sort' },
      { id: 'sorting-bucket', name: 'Bucket Sort' },
    ],
    pair: ['sorting-bubble', 'sorting-merge'],
    spec: { fields: ['array'], sortedArray: false, sorting: true },
    example: { array: [38, 27, 43, 3, 9, 82, 10, 55] },
  },
  {
    id: 'searching',
    title: 'Searching (sorted array)',
    algorithms: [
      { id: 'searching-linear', name: 'Linear Search' },
      { id: 'searching-binary', name: 'Binary Search' },
      { id: 'searching-jump', name: 'Jump Search' },
      { id: 'searching-exponential', name: 'Exponential Search' },
      { id: 'searching-interpolation', name: 'Interpolation Search' },
      { id: 'searching-ternary', name: 'Ternary Search' },
    ],
    pair: ['searching-linear', 'searching-binary'],
    spec: { fields: ['array', 'target'], sortedArray: true, sorting: false },
    example: { array: [3, 8, 14, 21, 29, 36, 44, 57, 63, 71, 88, 95], target: 71 },
  },
  {
    id: 'graph',
    title: 'Graph traversal',
    algorithms: [
      { id: 'graph-bfs', name: 'Breadth-First Search' },
      { id: 'graph-dfs', name: 'Depth-First Search' },
    ],
    pair: ['graph-bfs', 'graph-dfs'],
    spec: { fields: ['edges'], sortedArray: false, sorting: false },
    example: { edges: [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]] },
  },
];

export function groupOf(algorithmId: string): CompareGroup | undefined {
  return COMPARE_GROUPS.find((g) => g.algorithms.some((a) => a.id === algorithmId));
}

const COMPARISONS: AlgorithmAction[] = ['compare', 'search', 'search-left', 'search-right'];
const WRITES: AlgorithmAction[] = ['swap', 'shift', 'place', 'insert', 'merge', 'rotate', 'flip'];

export interface RunCounters {
  steps: number;
  comparisons: number;
  writes: number;
}

/** Counters after `upTo` (inclusive) steps of a run. */
export function countersAt(steps: AlgorithmStep[], upTo: number): RunCounters {
  const seen = steps.slice(0, Math.max(0, Math.min(upTo, steps.length - 1)) + 1);
  return {
    steps: seen.length,
    comparisons: seen.filter((s) => COMPARISONS.includes(s.action)).length,
    writes: seen.filter((s) => WRITES.includes(s.action)).length,
  };
}
