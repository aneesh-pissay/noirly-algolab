import { describe, expect, it } from 'vitest';
import { countAnagrams, longestUniqueSubstring, removeDuplicatesSorted, threeSum, twoSumSorted } from './patternAlgorithms';

const last = (steps: ReturnType<typeof twoSumSorted.generateSteps>) => steps[steps.length - 1];

describe('pattern step generators', () => {
  it('two sum (sorted) finds the pair with O(1) pointers', () => {
    expect(last(twoSumSorted.generateSteps({ array: [1, 2, 4, 7, 11, 15], target: 15 })).memory.answer).toEqual([2, 4]);
    expect(last(twoSumSorted.generateSteps({ array: [1, 2, 3], target: 100 })).action).toBe('not-found');
  });

  it('three sum lists unique triplets', () => {
    expect(last(threeSum.generateSteps({ array: [-1, 0, 1, 2, -1, -4] })).memory.triplets).toEqual(['-1,-1,2', '-1,0,1']);
  });

  it('remove duplicates keeps one of each value', () => {
    expect(last(removeDuplicatesSorted.generateSteps({ array: [1, 1, 2, 2, 2, 3, 4, 4] })).memory.unique).toEqual([1, 2, 3, 4]);
  });

  it('longest unique substring of "abcabcbb" has length 3', () => {
    expect(last(longestUniqueSubstring.generateSteps({ text: 'abcabcbb' })).variables.best).toBe(3);
    expect(last(longestUniqueSubstring.generateSteps({ text: 'pwwkew' })).variables.best).toBe(3);
  });

  it('counts anagram windows', () => {
    expect(last(countAnagrams.generateSteps({ text: 'cbaebabacd', pattern: 'abc' })).memory.starts).toEqual([0, 6]);
    expect(last(countAnagrams.generateSteps({ text: 'abab', pattern: 'ab' })).memory.starts).toEqual([0, 1, 2]);
  });

  it('emits steps the array renderer can draw', () => {
    for (const algo of [twoSumSorted, threeSum, removeDuplicatesSorted, longestUniqueSubstring, countAnagrams]) {
      const steps = algo.generateSteps({});
      expect(steps.length).toBeGreaterThan(2);
      steps.forEach((step, i) => {
        expect(step.id).toBe(i);
        expect(Array.isArray(step.visualizationData.array)).toBe(true);
      });
    }
  });
});
