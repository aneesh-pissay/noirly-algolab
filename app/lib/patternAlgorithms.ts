/**
 * Step generators for Patterns-track lessons that had no visualizer of their
 * own and were pointed at a different problem (spec B6). They live here, not
 * in src/core, and plug into the engine through its public registerAlgorithm
 * API; the AlgorithmStep contract is unchanged.
 */
import type { VisualizerEngine } from '@/src/core/engine/VisualizerEngine';
import type { Algorithm, AlgorithmAction, AlgorithmInput, AlgorithmStep, ComplexityInfo } from '@/src/core/engine/types';

type Payload = {
  action: AlgorithmAction;
  description: string;
  array: (number | string)[];
  highlights?: number[];
  variables?: Record<string, unknown>;
  memory?: Record<string, unknown>;
  extra?: Record<string, unknown>;
  codeLine: number;
};

function recorder(complexity: ComplexityInfo) {
  const steps: AlgorithmStep[] = [];
  return {
    steps,
    push(p: Payload) {
      steps.push({
        id: steps.length,
        category: 'pattern',
        action: p.action,
        description: p.description,
        visualizationData: { array: [...p.array], ...(p.extra ?? {}) },
        highlights: p.highlights ?? [],
        variables: p.variables ?? {},
        memory: p.memory ?? {},
        complexity,
        codeLine: p.codeLine,
      });
    },
  };
}

function numbers(input: AlgorithmInput, fallback: number[]): number[] {
  return Array.isArray(input.array) && input.array.every((n) => typeof n === 'number' && Number.isFinite(n)) ? [...input.array] : [...fallback];
}

function text(input: AlgorithmInput, key: string, fallback: string): string {
  const value = input[key] as unknown;
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function num(input: AlgorithmInput, key: string, fallback: number): number {
  const value = input[key] as unknown;
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function range(from: number, to: number): number[] {
  return to < from ? [] : Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

// --------------------------------------------------------------- Two Sum (sorted)

const twoSumSortedComplexity = { time: 'O(n)', space: 'O(1)' };

export const twoSumSorted: Algorithm = {
  name: 'Two Sum (Sorted, Two Pointers)',
  category: 'pattern',
  complexity: twoSumSortedComplexity,
  description: 'Finds two numbers in a sorted array that add up to the target by moving pointers inward from both ends.',
  generateSteps(input) {
    const array = numbers(input, [1, 2, 4, 7, 11, 15]).sort((a, b) => a - b);
    const target = num(input, 'target', 15);
    const r = recorder(twoSumSortedComplexity);
    let left = 0;
    let right = array.length - 1;
    r.push({ action: 'initialize', description: `Start with left at index 0 and right at index ${right}; target is ${target}.`, array, highlights: [left, right], variables: { left, right, target }, codeLine: 2 });
    while (left < right) {
      const sum = array[left] + array[right];
      r.push({ action: 'compare', description: `${array[left]} + ${array[right]} = ${sum}, compared with ${target}.`, array, highlights: [left, right], variables: { left, right, sum, target }, codeLine: 4 });
      if (sum === target) {
        r.push({ action: 'found', description: `Found it: indices ${left} and ${right} (${array[left]} + ${array[right]} = ${target}).`, array, highlights: [left, right], variables: { left, right, sum, target }, memory: { answer: [left, right] }, codeLine: 5 });
        return r.steps;
      }
      if (sum < target) {
        left += 1;
        r.push({ action: 'move-pointer', description: `Sum is too small, so move left up to index ${left} for a larger value.`, array, highlights: [left, right], variables: { left, right, target }, codeLine: 6 });
      } else {
        right -= 1;
        r.push({ action: 'move-pointer', description: `Sum is too large, so move right down to index ${right} for a smaller value.`, array, highlights: [left, right], variables: { left, right, target }, codeLine: 7 });
      }
    }
    r.push({ action: 'not-found', description: `The pointers met: no pair adds up to ${target}.`, array, variables: { target }, codeLine: 9 });
    return r.steps;
  },
};

// --------------------------------------------------------------- Three Sum

const threeSumComplexity = { time: 'O(n²)', space: 'O(1)' };

export const threeSum: Algorithm = {
  name: 'Three Sum',
  category: 'pattern',
  complexity: threeSumComplexity,
  description: 'Sorts the array, fixes one number, then finds pairs for it with two pointers, skipping duplicates.',
  generateSteps(input) {
    const original = numbers(input, [-1, 0, 1, 2, -1, -4]);
    const target = num(input, 'target', 0);
    const array = [...original].sort((a, b) => a - b);
    const r = recorder(threeSumComplexity);
    const triplets: number[][] = [];
    r.push({ action: 'initialize', description: `Sort the array so equal values sit together and pointers can move by size: [${array.join(', ')}].`, array, variables: { target }, codeLine: 2 });

    for (let i = 0; i < array.length - 2; i += 1) {
      if (i > 0 && array[i] === array[i - 1]) {
        r.push({ action: 'visit', description: `Skip index ${i}: ${array[i]} was already used as the fixed number.`, array, highlights: [i], variables: { i }, memory: { triplets: triplets.map((t) => t.join(',')) }, codeLine: 4 });
        continue;
      }
      let left = i + 1;
      let right = array.length - 1;
      r.push({ action: 'choose', description: `Fix ${array[i]} at index ${i}; look for two numbers summing to ${target - array[i]}.`, array, highlights: [i, left, right], variables: { i, left, right }, memory: { triplets: triplets.map((t) => t.join(',')) }, codeLine: 5 });
      while (left < right) {
        const sum = array[i] + array[left] + array[right];
        r.push({ action: 'compare', description: `${array[i]} + ${array[left]} + ${array[right]} = ${sum}.`, array, highlights: [i, left, right], variables: { i, left, right, sum }, memory: { triplets: triplets.map((t) => t.join(',')) }, codeLine: 7 });
        if (sum === target) {
          triplets.push([array[i], array[left], array[right]]);
          r.push({ action: 'found', description: `Triplet [${array[i]}, ${array[left]}, ${array[right]}] sums to ${target}.`, array, highlights: [i, left, right], variables: { i, left, right, sum }, memory: { triplets: triplets.map((t) => t.join(',')) }, codeLine: 8 });
          while (left < right && array[left] === array[left + 1]) left += 1;
          while (left < right && array[right] === array[right - 1]) right -= 1;
          left += 1;
          right -= 1;
          r.push({ action: 'move-pointer', description: 'Move both pointers past duplicates of the values just used.', array, highlights: [i, ...(left < right ? [left, right] : [])], variables: { i, left, right }, memory: { triplets: triplets.map((t) => t.join(',')) }, codeLine: 9 });
        } else if (sum < target) {
          left += 1;
          r.push({ action: 'move-pointer', description: 'Sum too small: move left right.', array, highlights: [i, left, right], variables: { i, left, right }, memory: { triplets: triplets.map((t) => t.join(',')) }, codeLine: 10 });
        } else {
          right -= 1;
          r.push({ action: 'move-pointer', description: 'Sum too large: move right left.', array, highlights: [i, left, right], variables: { i, left, right }, memory: { triplets: triplets.map((t) => t.join(',')) }, codeLine: 11 });
        }
      }
    }
    r.push({ action: triplets.length ? 'found' : 'not-found', description: triplets.length ? `Done: ${triplets.length} unique triplet${triplets.length === 1 ? '' : 's'}.` : 'Done: no triplet sums to the target.', array, memory: { triplets: triplets.map((t) => t.join(',')) }, codeLine: 14 });
    return r.steps;
  },
};

// --------------------------------------------------------------- Remove duplicates (sorted, in place)

const removeDupComplexity = { time: 'O(n)', space: 'O(1)' };

export const removeDuplicatesSorted: Algorithm = {
  name: 'Remove Duplicates (Two Pointers)',
  category: 'pattern',
  complexity: removeDupComplexity,
  description: 'Keeps a slow write pointer for the next unique slot and a fast read pointer scanning the sorted array.',
  generateSteps(input) {
    const array = numbers(input, [1, 1, 2, 2, 2, 3, 4, 4]).sort((a, b) => a - b);
    const r = recorder(removeDupComplexity);
    if (array.length === 0) {
      r.push({ action: 'initialize', description: 'Empty array: nothing to remove.', array, codeLine: 2 });
      return r.steps;
    }
    let write = 1;
    r.push({ action: 'initialize', description: 'The first value is always unique. The write pointer i starts at index 1.', array, highlights: [0], variables: { i: 1, j: 1 }, codeLine: 3 });
    for (let read = 1; read < array.length; read += 1) {
      r.push({ action: 'compare', description: `Compare ${array[read]} (index ${read}) with the last unique value ${array[write - 1]}.`, array, highlights: [write - 1, read], variables: { i: write, j: read }, codeLine: 5 });
      if (array[read] !== array[write - 1]) {
        array[write] = array[read];
        r.push({ action: 'place', description: `New value: write ${array[read]} at index ${write}.`, array, highlights: [write], variables: { i: write, j: read }, codeLine: 6 });
        write += 1;
      }
    }
    r.push({ action: 'found', description: `The first ${write} slots hold the unique values: [${array.slice(0, write).join(', ')}].`, array, highlights: range(0, write - 1), variables: { length: write }, memory: { unique: array.slice(0, write) }, codeLine: 10 });
    return r.steps;
  },
};

// --------------------------------------------------------------- Longest substring without repeats

const longestUniqueComplexity = { time: 'O(n)', space: 'O(k)' };

export const longestUniqueSubstring: Algorithm = {
  name: 'Longest Substring Without Repeating Characters',
  category: 'pattern',
  complexity: longestUniqueComplexity,
  description: 'Grows a window to the right and jumps its left edge past the previous copy of a repeated character.',
  generateSteps(input) {
    const s = text(input, 'text', 'abcabcbb');
    const chars = [...s];
    const r = recorder(longestUniqueComplexity);
    const lastSeen = new Map<string, number>();
    let left = 0;
    let best = 0;
    let bestStart = 0;
    r.push({ action: 'initialize', description: 'Start with an empty window at index 0.', array: chars, variables: { left: 0, best: 0 }, codeLine: 2 });
    for (let right = 0; right < chars.length; right += 1) {
      const c = chars[right];
      const seenAt = lastSeen.get(c);
      if (seenAt !== undefined && seenAt >= left) {
        left = seenAt + 1;
        r.push({ action: 'shift', description: `'${c}' is already in the window (index ${seenAt}); move left to ${left}.`, array: chars, highlights: range(left, right), variables: { left, right, best }, memory: { lastSeen: Object.fromEntries(lastSeen) }, codeLine: 5 });
      }
      lastSeen.set(c, right);
      if (right - left + 1 > best) {
        best = right - left + 1;
        bestStart = left;
      }
      r.push({ action: 'visit', description: `Window "${chars.slice(left, right + 1).join('')}" has length ${right - left + 1}; best so far ${best}.`, array: chars, highlights: range(left, right), variables: { left, right, best }, memory: { lastSeen: Object.fromEntries(lastSeen) }, codeLine: 7 });
    }
    r.push({ action: 'found', description: `Longest substring without repeats: "${chars.slice(bestStart, bestStart + best).join('')}" (length ${best}).`, array: chars, highlights: range(bestStart, bestStart + best - 1), variables: { best }, codeLine: 9 });
    return r.steps;
  },
};

// --------------------------------------------------------------- Count anagram windows

const countAnagramsComplexity = { time: 'O(n)', space: 'O(1)' };

export const countAnagrams: Algorithm = {
  name: 'Count Anagram Windows',
  category: 'pattern',
  complexity: countAnagramsComplexity,
  description: 'Slides a window the size of the pattern over the text, updating letter counts, and counts windows that are anagrams.',
  generateSteps(input) {
    const s = text(input, 'text', 'cbaebabacd');
    const p = text(input, 'pattern', 'abc');
    const chars = [...s];
    const k = p.length;
    const r = recorder(countAnagramsComplexity);
    const need = new Map<string, number>();
    for (const c of p) need.set(c, (need.get(c) ?? 0) + 1);
    const have = new Map<string, number>();
    const matches: number[] = [];
    const sameCounts = () => [...need].every(([c, n]) => have.get(c) === n) && [...have].every(([c, n]) => n === 0 || need.has(c));
    r.push({ action: 'initialize', description: `Count the letters of "${p}"; the window is ${k} wide.`, array: chars, variables: { k }, memory: { need: Object.fromEntries(need) }, codeLine: 2 });
    for (let right = 0; right < chars.length; right += 1) {
      have.set(chars[right], (have.get(chars[right]) ?? 0) + 1);
      const left = right - k + 1;
      if (left > 0) {
        const out = chars[left - 1];
        have.set(out, (have.get(out) ?? 0) - 1);
      }
      if (left < 0) {
        r.push({ action: 'visit', description: `Add '${chars[right]}' while the first window fills.`, array: chars, highlights: range(0, right), variables: { left: 0, right }, memory: { window: Object.fromEntries(have) }, codeLine: 4 });
        continue;
      }
      const match = sameCounts();
      if (match) matches.push(left);
      r.push({
        action: match ? 'found' : 'compare',
        description: match
          ? `"${chars.slice(left, right + 1).join('')}" is an anagram of "${p}" (window starting at ${left}).`
          : `"${chars.slice(left, right + 1).join('')}" has different letter counts.`,
        array: chars,
        highlights: range(left, right),
        variables: { left, right, count: matches.length },
        memory: { window: Object.fromEntries([...have].filter(([, n]) => n > 0)), starts: [...matches] },
        codeLine: match ? 7 : 6,
      });
    }
    r.push({ action: matches.length ? 'found' : 'not-found', description: `${matches.length} anagram window${matches.length === 1 ? '' : 's'}${matches.length ? ` starting at ${matches.join(', ')}` : ''}.`, array: chars, memory: { starts: matches }, codeLine: 9 });
    return r.steps;
  },
};

export const PATTERN_ALGORITHMS: Record<string, Algorithm> = {
  'array-two-sum-sorted': twoSumSorted,
  'array-three-sum': threeSum,
  'array-remove-duplicates-sorted': removeDuplicatesSorted,
  'string-longest-unique-substring': longestUniqueSubstring,
  'string-count-anagrams': countAnagrams,
};

export function registerPatternAlgorithms(engine: VisualizerEngine): void {
  for (const [id, algorithm] of Object.entries(PATTERN_ALGORITHMS)) engine.registerAlgorithm(id, algorithm);
}
