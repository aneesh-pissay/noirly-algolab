/** The standalone Visual Lab demos under /visual-lab/*, grouped for the index page and search. */
export interface VisualLab {
  slug: string;
  title: string;
}

export interface VisualLabGroup {
  id: string;
  title: string;
  description: string;
  labs: VisualLab[];
}

const lab = (slug: string, title: string): VisualLab => ({ slug, title });

export const visualLabGroups: VisualLabGroup[] = [
  {
    id: 'sorting',
    title: 'Sorting',
    description: 'Comparison and distribution sorts, step by step.',
    labs: [
      lab('bubble-sort', 'Bubble Sort'),
      lab('selection-sort', 'Selection Sort'),
      lab('insertion-sort', 'Insertion Sort'),
      lab('merge-sort', 'Merge Sort'),
      lab('quick-sort', 'Quick Sort'),
      lab('partition-algorithm', 'Partition (Lomuto/Hoare)'),
      lab('heap-sort', 'Heap Sort'),
      lab('shell-sort', 'Shell Sort'),
      lab('comb-sort', 'Comb Sort'),
      lab('cocktail-sort', 'Cocktail Sort'),
      lab('cycle-sort', 'Cycle Sort'),
      lab('pancake-sort', 'Pancake Sort'),
      lab('counting-sort', 'Counting Sort'),
      lab('radix-sort', 'Radix Sort'),
      lab('bucket-sort', 'Bucket Sort'),
      lab('tim-sort', 'Tim Sort'),
      lab('intro-sort', 'Intro Sort'),
    ],
  },
  {
    id: 'searching',
    title: 'Searching',
    description: 'Halving, jumping and probing through sorted data and trees.',
    labs: [
      lab('binary-search', 'Binary Search'),
      lab('jump-search', 'Jump Search'),
      lab('interpolation-search', 'Interpolation Search'),
      lab('exponential-search', 'Exponential Search'),
      lab('ternary-search', 'Ternary Search'),
      lab('bst-search', 'BST Search'),
      lab('avl-search', 'AVL Tree Search'),
      lab('red-black-search', 'Red-Black Tree Search'),
    ],
  },
  {
    id: 'two-pointers',
    title: 'Two pointers',
    description: 'Opposite-end and slow/fast pointer patterns.',
    labs: [
      lab('two-sum-sorted', 'Two Sum (Sorted)'),
      lab('three-sum', 'Three Sum'),
      lab('reverse-array', 'Reverse Array'),
      lab('remove-duplicates', 'Remove Duplicates'),
      lab('move-zeroes', 'Move Zeroes'),
      lab('palindrome-check', 'Palindrome Check'),
      lab('container-water', 'Container With Most Water'),
      lab('trapping-rain-water', 'Trapping Rain Water'),
      lab('middle-linked-list', 'Middle of Linked List'),
    ],
  },
  {
    id: 'sliding-window',
    title: 'Sliding window',
    description: 'Fixed and variable windows over arrays and strings.',
    labs: [
      lab('sliding-window', 'Sliding Window Basics'),
      lab('fixed-size-window', 'Fixed-Size Window'),
      lab('variable-window', 'Variable-Size Window'),
      lab('max-sum-size-k', 'Max Sum of Size K'),
      lab('average-subarray', 'Average of Subarrays'),
      lab('first-negative-number', 'First Negative in Window'),
      lab('min-size-subarray', 'Minimum Size Subarray Sum'),
      lab('sliding-window-max', 'Sliding Window Maximum'),
      lab('longest-unique-substring', 'Longest Unique Substring'),
      lab('character-replacement', 'Longest Repeating Replacement'),
      lab('k-distinct-chars', 'K Distinct Characters'),
      lab('fruit-basket', 'Fruit Into Baskets'),
      lab('min-window-substring', 'Minimum Window Substring'),
      lab('permutation-string', 'Permutation in String'),
      lab('count-anagrams', 'Count Anagrams'),
    ],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    description: 'Traversal, shortest paths and cycle detection.',
    labs: [
      lab('graph-bfs', 'Breadth-First Search'),
      lab('graph-dfs', 'Depth-First Search'),
      lab('dijkstra', "Dijkstra's Algorithm"),
      lab('bellman-ford', 'Bellman-Ford'),
      lab('a-star', 'A* Search'),
      lab('cycle-detection', 'Cycle Detection'),
    ],
  },
];

export const allVisualLabs: VisualLab[] = visualLabGroups.flatMap((group) => group.labs);
