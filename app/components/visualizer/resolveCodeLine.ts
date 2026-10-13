import { AlgorithmAction, AlgorithmCategory, AlgorithmStep } from '@/src/core/engine/types';

type LineRule = number | ((step: AlgorithmStep) => number);

const ALGORITHM_LINE_MAP: Record<string, Partial<Record<AlgorithmAction | 'default', LineRule>>> = {
  // Pattern lessons (app/lib/patternAlgorithms.ts) carry exact snippet lines.
  'array-two-sum-sorted': { default: (step) => step.codeLine },
  'array-three-sum': { default: (step) => step.codeLine },
  'array-remove-duplicates-sorted': { default: (step) => step.codeLine },
  'string-longest-unique-substring': { default: (step) => step.codeLine },
  'string-count-anagrams': { default: (step) => step.codeLine },
  'sorting-bubble': {
    initialize: 1,
    compare: 4,
    swap: 5,
    visit: 3,
    default: (step) => (step.description.includes('sorted') ? 8 : 3),
  },
  'sorting-selection': {
    initialize: 1,
    compare: 4,
    swap: 6,
    visit: 2,
  },
  'sorting-insertion': {
    initialize: 1,
    visit: 3,
    shift: 6,
    insert: 9,
  },
  'sorting-merge': {
    initialize: 1,
    divide: 2,
    merge: 6,
    compare: 5,
    visit: 3,
  },
  'sorting-quick': {
    initialize: 1,
    partition: 3,
    swap: 4,
    compare: 3,
    visit: 2,
  },
  'sorting-heap': {
    initialize: 1,
    'heap-build': 2,
    heapify: 4,
    swap: 5,
    compare: 4,
  },
  'searching-linear': {
    initialize: 1,
    compare: 3,
    found: 4,
    visit: 3,
  },
  'searching-binary': {
    initialize: 2,
    compare: 4,
    found: 5,
    'search-left': 6,
    'search-right': 7,
    search: 3,
  },
  'array-traversal': {
    traverse: (step) => (step.description.includes('complete') ? 4 : 2),
    visit: 3,
    initialize: 1,
  },
  'array-insert-element': {
    insert: 1,
    shift: 2,
    place: 3,
  },
  'array-delete-element': {
    delete: 1,
    shift: 2,
    place: 3,
  },
  'array-search-element': {
    compare: 3,
    found: 4,
    visit: 3,
    initialize: 1,
  },
  'array-reverse': {
    initialize: 1,
    swap: 3,
    compare: 2,
    visit: 2,
  },
  'stack-push-element': { push: 2, initialize: 1 },
  'stack-pop-element': { pop: 3, initialize: 1 },
  'stack-peek-top-element': { visit: 3, initialize: 1 },
  'queue-enqueue-element': { enqueue: 2, initialize: 1 },
  'queue-dequeue-element': { dequeue: 3, initialize: 1 },
};

const CATEGORY_LINE_MAP: Record<AlgorithmCategory, Partial<Record<AlgorithmAction | 'default', LineRule>>> = {
  sorting: {
    initialize: 1,
    compare: 4,
    swap: 5,
    visit: 2,
    shift: 4,
    insert: 5,
    merge: 6,
    partition: 3,
    divide: 2,
    default: 2,
  },
  searching: {
    initialize: 1,
    compare: 3,
    found: 4,
    'not-found': 5,
    search: 2,
    visit: 3,
    default: 2,
  },
  recursion: {
    initialize: 1,
    visit: 2,
    calculate: 3,
    default: 2,
  },
  tree: {
    traverse: 2,
    visit: 3,
    initialize: 1,
    default: 2,
  },
  graph: {
    visit: 3,
    traverse: 2,
    relax: 4,
    initialize: 1,
    default: 2,
  },
  dp: {
    calculate: 3,
    initialize: 1,
    visit: 2,
    default: 2,
  },
  pattern: {
    compare: 3,
    visit: 2,
    'move-pointer': 3,
    initialize: 1,
    default: 2,
  },
  'data-structure': {
    traverse: 2,
    visit: 3,
    insert: 1,
    shift: 2,
    place: 3,
    compare: 3,
    swap: 4,
    push: 2,
    pop: 3,
    enqueue: 2,
    dequeue: 3,
    delete: 1,
    initialize: 1,
    default: 2,
  },
};

function resolveRule(rule: LineRule, step: AlgorithmStep): number {
  return typeof rule === 'function' ? rule(step) : rule;
}

export function resolveActiveCodeLine(
  algorithmId: string,
  category: AlgorithmCategory,
  step: AlgorithmStep,
  lineCount: number
): number {
  const algoMap = ALGORITHM_LINE_MAP[algorithmId];
  if (algoMap) {
    const actionRule = algoMap[step.action];
    if (actionRule !== undefined) return clamp(resolveRule(actionRule, step), lineCount);
    if (algoMap.default) return clamp(resolveRule(algoMap.default, step), lineCount);
  }

  const categoryMap = CATEGORY_LINE_MAP[category];
  if (categoryMap) {
    const actionRule = categoryMap[step.action];
    if (actionRule !== undefined) return clamp(resolveRule(actionRule, step), lineCount);
    if (categoryMap.default) return clamp(resolveRule(categoryMap.default, step), lineCount);
  }

  return clamp(step.codeLine || 1, lineCount);
}

function clamp(line: number, max: number): number {
  if (max <= 0) return 1;
  return Math.max(1, Math.min(line, max));
}
