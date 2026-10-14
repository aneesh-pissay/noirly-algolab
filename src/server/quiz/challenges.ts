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

/**
 * Conceptual questions written for the most-visited lessons (spec F2),
 * keyed by algorithm id. They are asked alongside the questions derived
 * from the lesson's own run (derived.ts).
 */
export const conceptQuestions: Record<string, ChallengeQuestion[]> = {
  'sorting-bubble': [
    {
      id: 'c-bubble-pass',
      question: 'After the first full pass of bubble sort, which element is guaranteed to be in its final position?',
      options: ['The smallest element, at the front', 'The largest element, at the end', 'The middle element', 'No element is guaranteed yet'],
      correctAnswer: 1,
      explanation: 'Each pass carries the largest remaining value to the end of the unsorted part.',
    },
    {
      id: 'c-bubble-best',
      question: 'With the "stop if a pass makes no swaps" check, how long does bubble sort take on an already-sorted array?',
      options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: 'One pass finds no swaps and stops, so it costs n − 1 comparisons.',
    },
  ],
  'sorting-selection': [
    {
      id: 'c-selection-swaps',
      question: 'Why is selection sort sometimes chosen when writing to memory is expensive?',
      options: ['It never compares elements', 'It makes at most n − 1 swaps', 'It is O(n log n)', 'It is stable'],
      correctAnswer: 1,
      explanation: 'Each pass does a single swap to place the minimum, so writes stay O(n) even though comparisons are O(n²).',
    },
  ],
  'sorting-insertion': [
    {
      id: 'c-insertion-adaptive',
      question: 'On which input does insertion sort run fastest?',
      options: ['Reversed order', 'Random order', 'Already (or nearly) sorted', 'All elements equal and negative'],
      correctAnswer: 2,
      explanation: 'Each new element needs few or no shifts when the prefix is already in order, giving O(n).',
    },
  ],
  'sorting-merge': [
    {
      id: 'c-merge-space',
      question: 'What does merge sort trade for its guaranteed O(n log n) time on arrays?',
      options: ['Stability', 'O(n) extra memory for merging', 'Correctness on duplicates', 'It needs sorted input'],
      correctAnswer: 1,
      explanation: 'Merging two halves needs a temporary buffer the size of the range being merged.',
    },
    {
      id: 'c-merge-step',
      question: 'When merging [2, 7] and [3, 4], which element is written first?',
      options: ['2', '3', '4', '7'],
      correctAnswer: 0,
      explanation: 'Merge always takes the smaller of the two front elements: 2 < 3.',
    },
  ],
  'sorting-quick': [
    {
      id: 'c-quick-worst',
      question: 'When does quick sort with "first element as pivot" hit its O(n²) worst case?',
      options: ['On random input', 'On already-sorted input', 'When all values are distinct', 'Never'],
      correctAnswer: 1,
      explanation: 'Each partition then splits off just one element, so there are n levels of O(n) work.',
    },
    {
      id: 'c-quick-pivot',
      question: 'After one partition step, what is true of the pivot?',
      options: ['It is the smallest element', 'It sits in its final sorted position', 'It moves to the end', 'It is removed'],
      correctAnswer: 1,
      explanation: 'Everything smaller is on its left and everything larger on its right, so it never moves again.',
    },
  ],
  'searching-binary': [
    {
      id: 'c-binary-precondition',
      question: 'What must be true of the array for binary search to work?',
      options: ['It has no duplicates', 'It is sorted', 'Its length is a power of two', 'It contains the target'],
      correctAnswer: 1,
      explanation: 'Discarding half the range relies on everything left of mid being ≤ it and everything right ≥ it.',
    },
    {
      id: 'c-binary-steps',
      question: 'About how many comparisons does binary search need on 1,000,000 sorted elements in the worst case?',
      options: ['20', '1,000', '500,000', '1,000,000'],
      correctAnswer: 0,
      explanation: '2²⁰ ≈ 1,048,576, so about 20 halvings empty the range.',
    },
  ],
  'searching-linear': [
    {
      id: 'c-linear-when',
      question: 'When is linear search the right choice over binary search?',
      options: ['When the data is unsorted and searched only once', 'When the array is huge and sorted', 'Never', 'When values are integers'],
      correctAnswer: 0,
      explanation: 'Sorting first costs O(n log n), more than a single O(n) scan.',
    },
  ],
  'graph-bfs': [
    {
      id: 'c-bfs-shortest',
      question: 'In an unweighted graph, what does the order in which BFS first reaches each vertex give you?',
      options: ['A topological order', 'Shortest path lengths (in edges) from the start', 'A minimum spanning tree', 'Nothing in particular'],
      correctAnswer: 1,
      explanation: 'BFS visits all vertices at distance d before any at distance d + 1.',
    },
    {
      id: 'c-bfs-structure',
      question: 'Which data structure drives BFS?',
      options: ['Stack', 'Queue', 'Min-heap', 'Hash map'],
      correctAnswer: 1,
      explanation: 'First in, first out keeps vertices in order of distance.',
    },
  ],
  'graph-dfs': [
    {
      id: 'c-dfs-structure',
      question: 'Which structure does depth-first search use, explicitly or through recursion?',
      options: ['Queue', 'Stack', 'Priority queue', 'Union-find'],
      correctAnswer: 1,
      explanation: 'The most recently discovered vertex is explored first — last in, first out.',
    },
  ],
  'graph-dijkstra': [
    {
      id: 'c-dijkstra-negative',
      question: "Why can Dijkstra's algorithm give wrong answers with negative edge weights?",
      options: [
        'It cannot store negative numbers',
        'It finalises a vertex when popped, but a negative edge found later could still shorten its path',
        'It only works on trees',
        'Negative weights make the graph cyclic',
      ],
      correctAnswer: 1,
      explanation: 'The greedy choice assumes distances only grow along a path; negative edges break that.',
    },
  ],
  'graph-topological-sort': [
    {
      id: 'c-topo-dag',
      question: 'Which graphs have a topological ordering?',
      options: ['All directed graphs', 'Directed acyclic graphs only', 'Undirected graphs', 'Complete graphs'],
      correctAnswer: 1,
      explanation: 'A cycle would need a vertex to come both before and after another.',
    },
  ],
  'hashmap-two-sum': [
    {
      id: 'c-twosum-why',
      question: 'Why does the hash-map Two Sum check for the complement before storing the current value?',
      options: ['To save memory', 'So an element is never paired with itself', 'Because maps cannot store duplicates', 'It does not matter'],
      correctAnswer: 1,
      explanation: 'With target 6 and value 3, storing first would let 3 match itself.',
    },
  ],
  'hashmap-frequency-counter': [
    {
      id: 'c-freq-anagram',
      question: 'How can frequency counters tell whether two words are anagrams?',
      options: ['Compare their lengths only', 'Their letter counts are identical', 'Their first letters match', 'Sort one of them'],
      correctAnswer: 1,
      explanation: 'Anagrams use exactly the same letters the same number of times.',
    },
  ],
  'array-prefix-sum': [
    {
      id: 'c-prefix-range',
      question: 'With prefix sums p, what is the sum of array[2..5]?',
      options: ['p[5] − p[2]', 'p[5] − p[1]', 'p[5] + p[2]', 'p[6] − p[2]'],
      correctAnswer: 1,
      explanation: 'p[5] includes indices 0–5; subtracting p[1] removes indices 0–1.',
    },
  ],
  'array-kadane': [
    {
      id: 'c-kadane-reset',
      question: "In Kadane's algorithm, when does the running sum restart at the current element?",
      options: ['When the current element is negative', 'When the running sum plus the element is smaller than the element alone', 'Every k steps', 'Never'],
      correctAnswer: 1,
      explanation: 'A negative running sum only drags later subarrays down, so starting fresh is better.',
    },
  ],
};
