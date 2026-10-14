import { authoredTheory } from './authoredTheory';

export interface AlgorithmTheory {
  id: string;
  overview: string;
  howItWorks: string[];
  keyPoints: string[];
  useCases: string[];
  pros: string[];
  cons: string[];
}

const lessonTheory: Record<string, AlgorithmTheory> = {
  'reverse-array': {
    id: 'reverse-array',
    overview: 'The Reverse Array algorithm uses two pointers starting from opposite ends of the array, swapping elements as they move towards each other until they meet in the middle.',
    howItWorks: [
      'Initialize two pointers: left at the start (index 0) and right at the end (array.length - 1)',
      'While left pointer is less than right pointer, swap the elements at these positions',
      'Move left pointer one step forward and right pointer one step backward',
      'Repeat until pointers meet or cross each other',
      'The array is now reversed in-place'
    ],
    keyPoints: [
      'Two-pointer technique working from opposite ends',
      'In-place algorithm - no extra array needed',
      'Each element is swapped exactly once',
      'Time complexity: O(n) - visits each element once',
      'Space complexity: O(1) - only uses pointer variables'
    ],
    useCases: [
      'Reversing strings or character arrays',
      'Solving palindrome problems',
      'Array rotation problems',
      'Interview questions testing two-pointer technique'
    ],
    pros: [
      'Very efficient - O(n) time complexity',
      'Space efficient - O(1) space complexity',
      'Simple and easy to understand',
      'In-place modification saves memory'
    ],
    cons: [
      'Modifies the original array (not suitable if original needed)',
      'Not stable for complex objects',
      'Single-threaded approach only'
    ]
  },
  'bubble-sort': {
    id: 'bubble-sort',
    overview: 'Bubble Sort is a simple comparison-based sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.',
    howItWorks: [
      'Start at the beginning of the array',
      'Compare each pair of adjacent elements',
      'Swap them if they are in wrong order (first > second for ascending)',
      'After one complete pass, the largest element "bubbles up" to the end',
      'Repeat the process for remaining unsorted portion',
      'Continue until no more swaps are needed'
    ],
    keyPoints: [
      'Named for the way larger elements "bubble" to the end',
      'Comparison-based sorting algorithm',
      'Simple but inefficient for large datasets',
      'Time complexity: O(n²) in worst and average case',
      'Best case O(n) when array is already sorted'
    ],
    useCases: [
      'Small datasets where simplicity matters',
      'Educational purposes to teach sorting',
      'Nearly sorted data (performs better)',
      'When code simplicity is more important than efficiency'
    ],
    pros: [
      'Easy to understand and implement',
      'In-place sorting - O(1) extra space',
      'Stable sort - maintains relative order',
      'Adaptive - efficient for nearly sorted data'
    ],
    cons: [
      'Very slow for large datasets - O(n²)',
      'Poor performance compared to modern algorithms',
      'Not suitable for production use with large data',
      'Many unnecessary comparisons'
    ]
  },
  'fixed-size-window': {
    id: 'fixed-size-window',
    overview: 'The Fixed Size Window technique maintains a window of constant size K that slides through the array, processing elements as it moves from left to right.',
    howItWorks: [
      'Initialize a window of size K at the start of the array',
      'Process the first K elements to establish the initial window state',
      'Slide the window one position to the right',
      'Remove the leftmost element from the window',
      'Add the new rightmost element to the window',
      'Process the new window state',
      'Repeat until window reaches the end of array'
    ],
    keyPoints: [
      'Window size remains constant throughout',
      'Efficient by reusing previous computation',
      'Avoids recalculating from scratch for each position',
      'Time complexity: O(n) instead of O(n*k)',
      'Space complexity: O(1) or O(k) depending on tracking needs'
    ],
    useCases: [
      'Finding maximum/minimum in subarrays of size K',
      'Calculating moving averages',
      'Finding patterns in fixed-size segments',
      'Signal processing and time series analysis'
    ],
    pros: [
      'Optimal time complexity O(n)',
      'Reduces redundant calculations',
      'Simple and intuitive approach',
      'Easy to implement and debug'
    ],
    cons: [
      'Only works for fixed-size windows',
      'May need additional data structures for complex operations',
      'Not suitable for variable-size window problems'
    ]
  },
  'max-sum-size-k': {
    id: 'max-sum-size-k',
    overview: 'This algorithm finds the maximum sum of any contiguous subarray of size K using the sliding window technique to achieve optimal O(n) time complexity.',
    howItWorks: [
      'Calculate the sum of the first K elements (initial window)',
      'Set this as the current maximum sum',
      'Slide the window by removing the leftmost element',
      'Add the next element on the right to the window',
      'Update current sum = current sum - left element + right element',
      'Compare with maximum sum and update if larger',
      'Continue until all windows are checked'
    ],
    keyPoints: [
      'Sliding window optimization technique',
      'Avoids recalculating sum for overlapping elements',
      'Single pass through the array',
      'Time complexity: O(n)',
      'Space complexity: O(1)'
    ],
    useCases: [
      'Stock market analysis (max profit in K days)',
      'Weather data analysis (hottest K-day period)',
      'Network traffic monitoring',
      'Finding optimal time windows in datasets'
    ],
    pros: [
      'Highly efficient - O(n) time',
      'Minimal memory usage',
      'Easy to understand and implement',
      'Can be extended to find minimum, average, etc.'
    ],
    cons: [
      'Only works for fixed window size',
      'Requires array to fit in memory',
      'Cannot handle sparse or streaming data efficiently'
    ]
  }
};

/** Theory keyed by Visual Lab slug or algorithm id (see lessonTheory.ts for aliases). */
export const algorithmTheory: Record<string, AlgorithmTheory> = { ...lessonTheory, ...authoredTheory };
