/**
 * Authored quiz questions, keyed by algorithm id (or the theory alias in
 * bank.ts). Server-only: answers must never reach the client bundle.
 */
export interface ChallengeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const algorithmChallenges: Record<string, ChallengeQuestion[]> = {
  'reverse-array': [
    {
      id: 'rev-1',
      question: 'What is the key idea behind reversing an array with two pointers?',
      options: [
        'Use extra array and copy values in reverse order',
        'Swap elements from both ends while moving inward',
        'Sort the array in descending order',
        'Rotate the array by one position repeatedly',
      ],
      correctAnswer: 1,
      explanation:
        'Two pointers start at left and right ends, swap values, then move inward until they cross.',
    },
    {
      id: 'rev-2',
      question: 'What is the time complexity of in-place reverse array?',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n^2)'],
      correctAnswer: 2,
      explanation: 'Each element is visited at most once through roughly n/2 swaps, so it is O(n).',
    },
    {
      id: 'rev-3',
      question: 'What is the space complexity of this two-pointer approach?',
      options: ['O(n)', 'O(n log n)', 'O(1)', 'O(2n)'],
      correctAnswer: 2,
      explanation: 'It swaps in place and uses only a temporary variable, so auxiliary space is O(1).',
    },
  ],
};
