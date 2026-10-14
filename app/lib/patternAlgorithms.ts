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

// --------------------------------------------------------------- Max sum of a size-k window

const maxSumKComplexity = { time: 'O(n)', space: 'O(1)' };

export const maxSumSubarrayK: Algorithm = {
  name: 'Maximum Sum Subarray of Size K',
  category: 'pattern',
  complexity: maxSumKComplexity,
  description: 'Keeps a running sum of a fixed window of k numbers: add the number entering on the right, subtract the one leaving on the left.',
  generateSteps(input) {
    const array = numbers(input, [2, 1, 5, 1, 3, 2]);
    const k = num(input, 'k', 3);
    const r = recorder(maxSumKComplexity);
    if (k < 1 || k > array.length) {
      r.push({ action: 'not-found', description: `A window of ${k} does not fit in ${array.length} numbers.`, array, variables: { k }, codeLine: 8 });
      return r.steps;
    }
    let windowSum = 0;
    let best = -Infinity;
    let bestStart = 0;
    r.push({ action: 'initialize', description: `The window holds ${k} numbers. Start with an empty sum.`, array, variables: { k, windowSum }, codeLine: 2 });
    for (let right = 0; right < array.length; right += 1) {
      windowSum += array[right];
      const left = right - k + 1;
      if (right >= k) {
        windowSum -= array[right - k];
        r.push({ action: 'shift', description: `Slide right: add ${array[right]}, drop ${array[right - k]}. Sum is ${windowSum}.`, array, highlights: range(left, right), variables: { left, right, windowSum, best }, codeLine: 5 });
      } else {
        r.push({ action: 'visit', description: `Add ${array[right]} while the first window fills. Sum is ${windowSum}.`, array, highlights: range(0, right), variables: { right, windowSum }, codeLine: 4 });
      }
      if (right >= k - 1) {
        if (windowSum > best) {
          best = windowSum;
          bestStart = left;
          r.push({ action: 'found', description: `New best: [${array.slice(left, right + 1).join(', ')}] sums to ${best}.`, array, highlights: range(left, right), variables: { left, right, windowSum, best }, codeLine: 6 });
        } else {
          r.push({ action: 'compare', description: `${windowSum} does not beat the best of ${best}.`, array, highlights: range(left, right), variables: { left, right, windowSum, best }, codeLine: 6 });
        }
      }
    }
    r.push({ action: 'found', description: `The largest sum of ${k} consecutive numbers is ${best}, starting at index ${bestStart}.`, array, highlights: range(bestStart, bestStart + k - 1), variables: { best }, memory: { answer: best }, codeLine: 8 });
    return r.steps;
  },
};

// --------------------------------------------------------------- Averages of size-k windows

const averagesComplexity = { time: 'O(n)', space: 'O(n)' };

export const subarrayAverages: Algorithm = {
  name: 'Averages of Subarrays of Size K',
  category: 'pattern',
  complexity: averagesComplexity,
  description: 'Slides a window of k numbers across the array, reusing the previous sum to get each window average in O(1).',
  generateSteps(input) {
    const array = numbers(input, [1, 3, 2, 6, -1, 4, 1, 8, 2]);
    const k = num(input, 'k', 5);
    const r = recorder(averagesComplexity);
    if (k < 1 || k > array.length) {
      r.push({ action: 'not-found', description: `A window of ${k} does not fit in ${array.length} numbers.`, array, variables: { k }, codeLine: 8 });
      return r.steps;
    }
    const round = (x: number) => Math.round(x * 100) / 100;
    const result: number[] = [];
    let windowSum = 0;
    r.push({ action: 'initialize', description: `Each window holds ${k} numbers; the result starts empty.`, array, variables: { k, windowSum }, memory: { result: [] }, codeLine: 2 });
    for (let right = 0; right < array.length; right += 1) {
      windowSum += array[right];
      const left = right - k + 1;
      if (right >= k) {
        windowSum -= array[right - k];
        r.push({ action: 'shift', description: `Slide right: add ${array[right]}, drop ${array[right - k]}. Sum is ${windowSum}.`, array, highlights: range(left, right), variables: { left, right, windowSum }, memory: { result: [...result] }, codeLine: 5 });
      } else {
        r.push({ action: 'visit', description: `Add ${array[right]} while the first window fills. Sum is ${windowSum}.`, array, highlights: range(0, right), variables: { right, windowSum }, memory: { result: [...result] }, codeLine: 4 });
      }
      if (right >= k - 1) {
        result.push(round(windowSum / k));
        r.push({ action: 'place', description: `Average of [${array.slice(left, right + 1).join(', ')}] is ${windowSum} / ${k} = ${result[result.length - 1]}.`, array, highlights: range(left, right), variables: { left, right, windowSum }, memory: { result: [...result] }, codeLine: 6 });
      }
    }
    r.push({ action: 'found', description: `${result.length} window averages: [${result.join(', ')}].`, array, memory: { result }, codeLine: 8 });
    return r.steps;
  },
};

// --------------------------------------------------------------- Container with most water

const containerComplexity = { time: 'O(n)', space: 'O(1)' };

export const containerMostWater: Algorithm = {
  name: 'Container With Most Water',
  category: 'pattern',
  complexity: containerComplexity,
  description: 'Starts with the widest container and moves the shorter wall inward, since only a taller wall can make a narrower container hold more.',
  generateSteps(input) {
    const array = numbers(input, [1, 8, 6, 2, 5, 4, 8, 3, 7]).map(Math.abs);
    const r = recorder(containerComplexity);
    let left = 0;
    let right = array.length - 1;
    let best = 0;
    let bestPair: [number, number] = [0, right];
    r.push({ action: 'initialize', description: `Start with the widest container: walls at index 0 and ${right}.`, array, highlights: [left, right], variables: { left, right, best }, codeLine: 2 });
    while (left < right) {
      const area = Math.min(array[left], array[right]) * (right - left);
      r.push({ action: 'compare', description: `Water between ${array[left]} and ${array[right]}: min height ${Math.min(array[left], array[right])} × width ${right - left} = ${area}.`, array, highlights: [left, right], variables: { left, right, area, best }, codeLine: 4 });
      if (area > best) {
        best = area;
        bestPair = [left, right];
        r.push({ action: 'found', description: `New best area: ${best}.`, array, highlights: [left, right], variables: { left, right, area, best }, codeLine: 5 });
      }
      if (array[left] < array[right]) {
        left += 1;
        r.push({ action: 'move-pointer', description: `The left wall is shorter, so move left to index ${left}.`, array, highlights: [left, right], variables: { left, right, best }, codeLine: 6 });
      } else {
        right -= 1;
        r.push({ action: 'move-pointer', description: `The right wall is not taller, so move right to index ${right}.`, array, highlights: [left, right], variables: { left, right, best }, codeLine: 7 });
      }
    }
    r.push({ action: 'found', description: `Most water: ${best}, between indices ${bestPair[0]} and ${bestPair[1]}.`, array, highlights: bestPair, variables: { best }, memory: { answer: best }, codeLine: 9 });
    return r.steps;
  },
};

// --------------------------------------------------------------- Happy number (fast & slow)

const happyComplexity = { time: 'O(log n)', space: 'O(1)' };

function digitSquareSum(x: number): number {
  let sum = 0;
  for (; x > 0; x = Math.floor(x / 10)) sum += (x % 10) ** 2;
  return sum;
}

export const happyNumberFastSlow: Algorithm = {
  name: 'Happy Number (Fast & Slow)',
  category: 'pattern',
  complexity: happyComplexity,
  description: 'Treats "replace n by the sum of the squares of its digits" as a linked list and runs Floyd cycle detection on it, with no set.',
  generateSteps(input) {
    const n = Math.abs(Math.trunc(num(input, 'target', 19))) || 19;
    // The chain of values n, next(n), …, laid out like a list whose last
    // element points back to `loopTo` (1 points to itself).
    const chain = [n];
    let loopTo = -1;
    while (loopTo < 0) {
      const value = digitSquareSum(chain[chain.length - 1]);
      loopTo = chain.indexOf(value);
      if (loopTo < 0) chain.push(value);
    }
    const step = (i: number) => (i < chain.length - 1 ? i + 1 : loopTo);
    const r = recorder(happyComplexity);
    let slow = 0;
    let fast = step(0);
    r.push({ action: 'initialize', description: `slow starts at ${n}, fast one step ahead at ${chain[fast]}. Each value leads to the sum of its digits squared.`, array: chain, highlights: [slow, fast], variables: { slow: chain[slow], fast: chain[fast] }, codeLine: 2 });
    while (chain[fast] !== 1 && slow !== fast) {
      slow = step(slow);
      fast = step(step(fast));
      r.push({ action: 'move-pointer', description: `slow moves one step to ${chain[slow]}; fast moves two steps to ${chain[fast]}.`, array: chain, highlights: [slow, fast], variables: { slow: chain[slow], fast: chain[fast] }, codeLine: 4 });
    }
    const happy = chain[fast] === 1;
    r.push({
      action: happy ? 'found' : 'not-found',
      description: happy ? `fast reached 1, so ${n} is happy.` : `slow and fast met at ${chain[slow]} without reaching 1: the values loop forever, so ${n} is not happy.`,
      array: chain,
      highlights: [fast],
      variables: { isHappy: happy },
      memory: { answer: happy },
      codeLine: 7,
    });
    return r.steps;
  },
};

// --------------------------------------------------------------- Palindrome linked list

const palindromeListComplexity = { time: 'O(n)', space: 'O(1)' };

export const palindromeLinkedList: Algorithm = {
  name: 'Palindrome Linked List',
  category: 'pattern',
  complexity: palindromeListComplexity,
  description: 'Finds the middle with slow and fast pointers, reverses the second half in place, then walks both halves together comparing values.',
  generateSteps(input) {
    const list = numbers(input, [1, 2, 3, 2, 1]);
    const r = recorder(palindromeListComplexity);
    let slow = 0;
    let fast = 0;
    r.push({ action: 'initialize', description: 'The list is shown left to right, one box per node. slow and fast start at the head.', array: list, highlights: [0], variables: { slow, fast }, codeLine: 2 });
    while (fast < list.length && fast + 1 < list.length) {
      slow += 1;
      fast += 2;
      r.push({ action: 'move-pointer', description: `slow → node ${slow}, fast → ${fast < list.length ? `node ${fast}` : 'null'}.`, array: list, highlights: fast < list.length ? [slow, fast] : [slow], variables: { slow, fast }, codeLine: 3 });
    }
    const second = range(slow, list.length - 1);
    r.push({ action: 'flip', description: `fast hit the end, so slow is at the middle. Reverse the second half (nodes ${slow}–${list.length - 1}) so it can be walked from the tail.`, array: list, highlights: second, variables: { mid: slow }, codeLine: 4 });
    for (let i = 0; i < list.length - slow; i += 1) {
      const j = list.length - 1 - i;
      if (list[i] !== list[j]) {
        r.push({ action: 'not-found', description: `${list[i]} ≠ ${list[j]}: not a palindrome.`, array: list, highlights: [i, j], variables: { first: list[i], second: list[j] }, memory: { answer: false }, codeLine: 7 });
        return r.steps;
      }
      r.push({ action: 'compare', description: `Front node ${i} (${list[i]}) matches back node ${j} (${list[j]}).`, array: list, highlights: [i, j], variables: { first: list[i], second: list[j] }, codeLine: 7 });
    }
    r.push({ action: 'found', description: 'Every pair matched: the list is a palindrome.', array: list, highlights: range(0, list.length - 1), memory: { answer: true }, codeLine: 10 });
    return r.steps;
  },
};

// --------------------------------------------------------------- Cycle start (Floyd)

const cycleStartComplexity = { time: 'O(n)', space: 'O(1)' };

export const cycleStart: Algorithm = {
  name: 'Linked List Cycle Start',
  category: 'pattern',
  complexity: cycleStartComplexity,
  description: 'Finds where a cycle begins: after slow and fast meet, a pointer from the head and one from the meeting point reach the cycle start together.',
  generateSteps(input) {
    const list = numbers(input, [3, 2, 0, -4, 6, 8]);
    const loopTo = Math.trunc(num(input, 'target', 2));
    const hasCycle = loopTo >= 0 && loopTo < list.length;
    const step = (i: number) => (i < 0 ? -1 : i < list.length - 1 ? i + 1 : hasCycle ? loopTo : -1);
    const r = recorder(cycleStartComplexity);
    let slow = 0;
    let fast = 0;
    r.push({
      action: 'initialize',
      description: hasCycle ? `The tail links back to node ${loopTo}. slow and fast start at the head.` : 'The tail points to null. slow and fast start at the head.',
      array: list,
      highlights: [0],
      variables: { slow, fast, tailLinksTo: hasCycle ? loopTo : null },
      codeLine: 2,
    });
    let met = false;
    while (fast >= 0 && step(fast) >= 0) {
      slow = step(slow);
      fast = step(step(fast));
      if (fast < 0) break;
      r.push({ action: 'move-pointer', description: `slow → node ${slow}, fast → node ${fast}.`, array: list, highlights: [slow, fast], variables: { slow, fast }, codeLine: 4 });
      if (slow === fast) {
        met = true;
        r.push({ action: 'compare', description: `slow and fast meet at node ${slow}: there is a cycle.`, array: list, highlights: [slow], variables: { slow, fast }, codeLine: 5 });
        break;
      }
    }
    if (!met) {
      r.push({ action: 'not-found', description: 'fast reached null, so there is no cycle.', array: list, variables: { answer: null }, memory: { answer: null }, codeLine: 7 });
      return r.steps;
    }
    slow = 0;
    r.push({ action: 'move-pointer', description: 'Move slow back to the head; fast stays at the meeting point. Both now move one step at a time.', array: list, highlights: [slow, fast], variables: { slow, fast }, codeLine: 8 });
    while (slow !== fast) {
      slow = step(slow);
      fast = step(fast);
      r.push({ action: 'move-pointer', description: `slow → node ${slow}, fast → node ${fast}.`, array: list, highlights: [slow, fast], variables: { slow, fast }, codeLine: 9 });
    }
    r.push({ action: 'found', description: `They meet at node ${slow} (value ${list[slow]}): the cycle starts here.`, array: list, highlights: [slow], variables: { start: slow }, memory: { answer: slow }, codeLine: 10 });
    return r.steps;
  },
};

// --------------------------------------------------------------- Find the duplicate number (Floyd)

const findDuplicateComplexity = { time: 'O(n)', space: 'O(1)' };

export const findDuplicateNumber: Algorithm = {
  name: 'Find the Duplicate Number',
  category: 'pattern',
  complexity: findDuplicateComplexity,
  description: 'Reads each value as a pointer to the index it names. The repeated value is where two pointers lead, so it is the start of a cycle, found with Floyd.',
  generateSteps(input) {
    const array = numbers(input, [1, 3, 4, 2, 2]);
    const r = recorder(findDuplicateComplexity);
    const n = array.length - 1;
    if (n < 1 || !array.every((v) => Number.isInteger(v) && v >= 1 && v <= n)) {
      r.push({ action: 'not-found', description: `Needs ${array.length} numbers each between 1 and ${Math.max(n, 1)}, so that every value is a valid index.`, array, codeLine: 1 });
      return r.steps;
    }
    let slow = array[0];
    let fast = array[0];
    r.push({ action: 'initialize', description: `Each value points to an index. Start both pointers at nums[0] = ${slow}.`, array, highlights: [0, slow], variables: { slow, fast }, codeLine: 2 });
    do {
      slow = array[slow];
      fast = array[array[fast]];
      r.push({ action: 'move-pointer', description: `slow jumps once to index ${slow}; fast jumps twice to index ${fast}.`, array, highlights: [slow, fast], variables: { slow, fast }, codeLine: 5 });
    } while (slow !== fast);
    r.push({ action: 'compare', description: `slow and fast meet at index ${slow}, which is inside the cycle.`, array, highlights: [slow], variables: { slow, fast }, codeLine: 6 });
    slow = array[0];
    r.push({ action: 'move-pointer', description: `Restart slow at nums[0] = ${slow}; both now jump once per step.`, array, highlights: [slow, fast], variables: { slow, fast }, codeLine: 7 });
    while (slow !== fast) {
      slow = array[slow];
      fast = array[fast];
      r.push({ action: 'move-pointer', description: `slow → index ${slow}, fast → index ${fast}.`, array, highlights: [slow, fast], variables: { slow, fast }, codeLine: 10 });
    }
    r.push({ action: 'found', description: `They meet at ${slow}: the cycle's entrance, which is the duplicate value.`, array, highlights: array.flatMap((v, i) => (v === slow ? [i] : [])), variables: { duplicate: slow }, memory: { answer: slow }, codeLine: 12 });
    return r.steps;
  },
};

export const PATTERN_ALGORITHMS: Record<string, Algorithm> = {
  'array-two-sum-sorted': twoSumSorted,
  'array-three-sum': threeSum,
  'array-remove-duplicates-sorted': removeDuplicatesSorted,
  'string-longest-unique-substring': longestUniqueSubstring,
  'string-count-anagrams': countAnagrams,
  'array-max-sum-subarray-k': maxSumSubarrayK,
  'array-subarray-averages': subarrayAverages,
  'array-container-most-water': containerMostWater,
  'number-happy-fast-slow': happyNumberFastSlow,
  'linked-list-palindrome': palindromeLinkedList,
  'linked-list-cycle-start': cycleStart,
  'array-find-duplicate-number': findDuplicateNumber,
};

export function registerPatternAlgorithms(engine: VisualizerEngine): void {
  for (const [id, algorithm] of Object.entries(PATTERN_ALGORITHMS)) engine.registerAlgorithm(id, algorithm);
}
