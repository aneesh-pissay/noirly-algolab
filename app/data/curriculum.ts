export type TrackId = 'data-structures' | 'algorithms' | 'patterns';
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type LessonStatus = 'completed' | 'in-progress' | 'not-started' | 'locked';

export interface Lesson {
  id: string;
  name: string;
  algorithmId: string;
  difficulty: Difficulty;
  time: string;
  space: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  lessons: Record<Difficulty, Lesson[]>;
}

export interface Track {
  id: TrackId;
  title: string;
  description: string;
  topics: Record<Level, Topic[]>;
}

function lesson(
  id: string,
  name: string,
  algorithmId: string,
  difficulty: Difficulty,
  time: string,
  space: string
): Lesson {
  return { id, name, algorithmId, difficulty, time, space };
}

export const tracks: Track[] = [
  {
    id: 'data-structures',
    title: 'Data Structures',
    description: 'Master ways to organize and store data efficiently.',
    topics: {
      Beginner: [
        {
          id: 'arrays',
          name: 'Arrays',
          description: 'Indexed collections — traversal, mutation, and classic patterns.',
          lessons: {
            Easy: [
              lesson('array-traversal', 'Traversal', 'array-traversal', 'Easy', 'O(n)', 'O(1)'),
              lesson('array-insert', 'Insert', 'array-insert-element', 'Easy', 'O(n)', 'O(1)'),
              lesson('array-delete', 'Delete', 'array-delete-element', 'Easy', 'O(n)', 'O(1)'),
              lesson('array-search', 'Search', 'array-search-element', 'Easy', 'O(n)', 'O(1)'),
              lesson('array-reverse', 'Reverse', 'array-reverse', 'Easy', 'O(n)', 'O(1)'),
              lesson('array-max-min', 'Find Max/Min', 'array-find-max-min', 'Easy', 'O(n)', 'O(1)'),
            ],
            Medium: [
              lesson('array-rotate', 'Rotate', 'array-rotate', 'Medium', 'O(n)', 'O(1)'),
              lesson('array-prefix-sum', 'Prefix Sum', 'array-prefix-sum', 'Medium', 'O(n)', 'O(n)'),
              lesson('array-two-sum', 'Two Sum', 'array-two-sum', 'Medium', 'O(n)', 'O(n)'),
              lesson('array-kadane', 'Kadane', 'array-kadane', 'Medium', 'O(n)', 'O(1)'),
              lesson('array-merge-sorted', 'Merge Sorted', 'array-merge-sorted', 'Medium', 'O(n+m)', 'O(1)'),
              lesson('array-dutch-flag', 'Dutch Flag', 'array-dutch-flag', 'Medium', 'O(n)', 'O(1)'),
            ],
            Hard: [
              lesson('array-product', 'Product Except Self', 'array-product-except-self', 'Hard', 'O(n)', 'O(1)'),
              lesson('array-intervals', 'Merge Intervals', 'array-merge-intervals', 'Hard', 'O(n log n)', 'O(n)'),
              lesson('array-next-perm', 'Next Permutation', 'array-next-permutation', 'Hard', 'O(n)', 'O(1)'),
              lesson('array-rain', 'Trapping Rain Water', 'array-rain-water', 'Hard', 'O(n)', 'O(1)'),
              lesson('array-histogram', 'Largest Rectangle', 'array-histogram-area', 'Hard', 'O(n)', 'O(n)'),
            ],
          },
        },
        {
          id: 'strings',
          name: 'Strings',
          description: 'Text manipulation, matching, and advanced string algorithms.',
          lessons: {
            Easy: [
              lesson('string-traversal', 'Traversal', 'string-traversal', 'Easy', 'O(n)', 'O(1)'),
              lesson('string-reverse', 'Reverse', 'string-reverse', 'Easy', 'O(n)', 'O(n)'),
              lesson('string-palindrome', 'Palindrome Check', 'string-palindrome-check', 'Easy', 'O(n)', 'O(1)'),
              lesson('string-count', 'Character Count', 'string-character-count', 'Easy', 'O(n)', 'O(1)'),
              lesson('string-spaces', 'Remove Spaces', 'string-remove-spaces', 'Easy', 'O(n)', 'O(n)'),
            ],
            Medium: [
              lesson('string-anagram', 'Valid Anagram', 'string-valid-anagram', 'Medium', 'O(n)', 'O(1)'),
              lesson('string-compress', 'Compression', 'string-compression', 'Medium', 'O(n)', 'O(n)'),
              lesson('string-lcp', 'Longest Common Prefix', 'string-longest-common-prefix', 'Medium', 'O(n·m)', 'O(1)'),
              lesson('string-substring', 'Substring Search', 'string-substring-search', 'Medium', 'O(n·m)', 'O(1)'),
              lesson('string-group-anagrams', 'Group Anagrams', 'string-group-anagrams', 'Medium', 'O(n·k)', 'O(n·k)'),
            ],
            Hard: [
              lesson('string-lps', 'Longest Palindromic Substring', 'string-longest-palindromic-substring', 'Hard', 'O(n²)', 'O(1)'),
              lesson('string-min-window', 'Minimum Window', 'string-minimum-window-substring', 'Hard', 'O(n)', 'O(1)'),
              lesson('string-rabin-karp', 'Rabin-Karp', 'string-rabin-karp', 'Hard', 'O(n+m)', 'O(m)'),
              lesson('string-kmp', 'KMP', 'string-kmp', 'Hard', 'O(n+m)', 'O(m)'),
              lesson('string-manacher', 'Manacher', 'string-manacher', 'Hard', 'O(n)', 'O(n)'),
            ],
          },
        },
        {
          id: 'hashmap',
          name: 'HashMap',
          description: 'Key-value lookups, frequency maps, and cache designs.',
          lessons: {
            Easy: [
              lesson('hashmap-create', 'Create', 'hashmap-create', 'Easy', 'O(1)', 'O(n)'),
              lesson('hashmap-insert', 'Insert', 'hashmap-insert-key', 'Easy', 'O(1)', 'O(1)'),
              lesson('hashmap-lookup', 'Lookup', 'hashmap-lookup-key', 'Easy', 'O(1)', 'O(1)'),
              lesson('hashmap-delete', 'Delete', 'hashmap-delete-key', 'Easy', 'O(1)', 'O(1)'),
            ],
            Medium: [
              lesson('hashmap-freq', 'Frequency Counter', 'hashmap-frequency-counter', 'Medium', 'O(n)', 'O(n)'),
              lesson('hashmap-two-sum', 'Two Sum', 'hashmap-two-sum', 'Medium', 'O(n)', 'O(n)'),
              lesson('hashmap-first-unique', 'First Unique Char', 'hashmap-first-unique-character', 'Medium', 'O(n)', 'O(1)'),
              lesson('hashmap-group-anagrams', 'Group Anagrams', 'hashmap-group-anagrams', 'Medium', 'O(n·k)', 'O(n·k)'),
            ],
            Hard: [
              lesson('hashmap-subarray-k', 'Subarray Sum K', 'hashmap-subarray-sum-equals-k', 'Hard', 'O(n)', 'O(n)'),
              lesson('hashmap-top-k', 'Top K Frequent', 'hashmap-top-k-frequent-elements', 'Hard', 'O(n log k)', 'O(n)'),
              lesson('hashmap-lru', 'LRU Cache', 'hashmap-lru-cache', 'Hard', 'O(1)', 'O(n)'),
              lesson('hashmap-lfu', 'LFU Cache', 'hashmap-lfu-cache', 'Hard', 'O(log n)', 'O(n)'),
              lesson('hashmap-design', 'Design HashMap', 'hashmap-design-hashmap', 'Hard', 'O(1)', 'O(n)'),
            ],
          },
        },
        {
          id: 'hashset',
          name: 'HashSet',
          description: 'Unique value tracking and set-based problem solving.',
          lessons: {
            Easy: [
              lesson('hashset-add', 'Add', 'hashset-add-element', 'Easy', 'O(1)', 'O(n)'),
              lesson('hashset-remove', 'Remove', 'hashset-remove-element', 'Easy', 'O(1)', 'O(1)'),
              lesson('hashset-contains', 'Contains', 'hashset-contains-element', 'Easy', 'O(1)', 'O(1)'),
            ],
            Medium: [
              lesson('hashset-duplicate', 'Contains Duplicate', 'hashset-contains-duplicate', 'Medium', 'O(n)', 'O(n)'),
              lesson('hashset-remove-dup', 'Remove Duplicates', 'hashset-remove-duplicates', 'Medium', 'O(n)', 'O(n)'),
              lesson('hashset-intersection', 'Intersection', 'hashset-intersection-of-arrays', 'Medium', 'O(n+m)', 'O(n)'),
              lesson('hashset-missing', 'Missing Number', 'hashset-find-missing-number', 'Medium', 'O(n)', 'O(n)'),
            ],
            Hard: [
              lesson('hashset-happy', 'Happy Number', 'hashset-happy-number', 'Hard', 'O(log n)', 'O(log n)'),
              lesson('hashset-consecutive', 'Longest Consecutive', 'hashset-longest-consecutive-sequence', 'Hard', 'O(n)', 'O(n)'),
              lesson('hashset-sudoku', 'Sudoku Validation', 'hashset-sudoku-validation', 'Hard', 'O(81)', 'O(81)'),
            ],
          },
        },
        {
          id: 'stack',
          name: 'Stack',
          description: 'LIFO structures for parsing, monotonic patterns, and undo flows.',
          lessons: {
            Easy: [
              lesson('stack-push', 'Push', 'stack-push-element', 'Easy', 'O(1)', 'O(1)'),
              lesson('stack-pop', 'Pop', 'stack-pop-element', 'Easy', 'O(1)', 'O(1)'),
              lesson('stack-peek', 'Peek', 'stack-peek-top-element', 'Easy', 'O(1)', 'O(1)'),
            ],
            Medium: [
              lesson('stack-reverse-str', 'Reverse String', 'stack-reverse-string-using-stack', 'Medium', 'O(n)', 'O(n)'),
              lesson('stack-valid-parens', 'Valid Parentheses', 'stack-valid-parentheses', 'Medium', 'O(n)', 'O(n)'),
              lesson('stack-min', 'Min Stack', 'stack-min-stack', 'Medium', 'O(1)', 'O(n)'),
              lesson('stack-nge', 'Next Greater Element', 'stack-next-greater-element', 'Medium', 'O(n)', 'O(n)'),
            ],
            Hard: [
              lesson('stack-daily-temp', 'Daily Temperatures', 'stack-daily-temperatures', 'Hard', 'O(n)', 'O(n)'),
              lesson('stack-decode', 'Decode String', 'stack-decode-string', 'Hard', 'O(n)', 'O(n)'),
              lesson('stack-histogram', 'Largest Histogram', 'stack-largest-rectangle-histogram', 'Hard', 'O(n)', 'O(n)'),
              lesson('stack-max-rect', 'Maximal Rectangle', 'stack-maximal-rectangle', 'Hard', 'O(rows·cols)', 'O(cols)'),
              lesson('stack-expr', 'Expression Parser', 'stack-expression-parser', 'Hard', 'O(n)', 'O(n)'),
            ],
          },
        },
        {
          id: 'queue',
          name: 'Queue',
          description: 'FIFO processing, BFS foundations, and scheduling patterns.',
          lessons: {
            Easy: [
              lesson('queue-enqueue', 'Enqueue', 'queue-enqueue-element', 'Easy', 'O(1)', 'O(1)'),
              lesson('queue-dequeue', 'Dequeue', 'queue-dequeue-element', 'Easy', 'O(1)', 'O(1)'),
              lesson('queue-front-rear', 'Front & Rear', 'queue-front-rear', 'Easy', 'O(1)', 'O(1)'),
              lesson('queue-traverse', 'Traverse', 'queue-traverse', 'Easy', 'O(n)', 'O(1)'),
            ],
            Medium: [
              lesson('queue-circular', 'Circular Queue', 'queue-circular-queue', 'Medium', 'O(1)', 'O(n)'),
              lesson('queue-stack-via-queue', 'Stack via Queue', 'queue-implement-stack-using-queue', 'Medium', 'O(n)', 'O(n)'),
              lesson('queue-reverse', 'Reverse Queue', 'queue-reverse-queue', 'Medium', 'O(n)', 'O(n)'),
              lesson('queue-level-order', 'Level Order', 'queue-level-order-traversal', 'Medium', 'O(n)', 'O(n)'),
            ],
            Hard: [
              lesson('queue-deque', 'Double Ended Queue', 'queue-double-ended-queue', 'Hard', 'O(1)', 'O(n)'),
              lesson('queue-monotonic', 'Monotonic Queue', 'queue-monotonic-queue', 'Hard', 'O(n)', 'O(n)'),
              lesson('queue-sliding-max', 'Sliding Window Max', 'queue-sliding-window-maximum', 'Hard', 'O(n)', 'O(k)'),
              lesson('queue-task-sched', 'Task Scheduler', 'queue-task-scheduler', 'Hard', 'O(n)', 'O(1)'),
            ],
          },
        },
      ],
      Intermediate: [
        {
          id: 'linked-list',
          name: 'Linked List',
          description: 'Pointer-based sequences with reversal and cycle patterns.',
          lessons: {
            Easy: [
              lesson('ll-create', 'Create', 'linked-list-create', 'Easy', 'O(n)', 'O(n)'),
              lesson('ll-traverse', 'Traverse', 'linked-list-traverse', 'Easy', 'O(n)', 'O(1)'),
              lesson('ll-insert', 'Insert', 'linked-list-insert-node', 'Easy', 'O(n)', 'O(1)'),
              lesson('ll-delete', 'Delete', 'linked-list-delete-node', 'Easy', 'O(n)', 'O(1)'),
            ],
            Medium: [
              lesson('ll-search', 'Search', 'linked-list-search-node', 'Medium', 'O(n)', 'O(1)'),
              lesson('ll-length', 'Find Length', 'linked-list-find-length', 'Medium', 'O(n)', 'O(1)'),
              lesson('ll-reverse', 'Reverse', 'linked-list-reverse', 'Medium', 'O(n)', 'O(1)'),
              lesson('ll-middle', 'Middle Node', 'linked-list-middle', 'Medium', 'O(n)', 'O(1)'),
            ],
            Hard: [
              lesson('ll-cycle', 'Detect Cycle', 'linked-list-detect-cycle', 'Hard', 'O(n)', 'O(1)'),
              lesson('ll-merge-sorted', 'Merge Sorted', 'linked-list-merge-two-sorted', 'Hard', 'O(n+m)', 'O(1)'),
              lesson('ll-reverse-k', 'Reverse K Group', 'linked-list-reverse-k-group', 'Hard', 'O(n)', 'O(1)'),
              lesson('ll-merge-k', 'Merge K Sorted', 'linked-list-merge-k-sorted', 'Hard', 'O(n log k)', 'O(1)'),
              lesson('ll-lru', 'LRU Cache', 'linked-list-lru-cache', 'Hard', 'O(1)', 'O(n)'),
            ],
          },
        },
        {
          id: 'binary-tree',
          name: 'Binary Tree',
          description: 'Hierarchical data with traversals and path problems.',
          lessons: {
            Easy: [
              lesson('bt-create', 'Create', 'binary-tree-create', 'Easy', 'O(n)', 'O(n)'),
              lesson('bt-preorder', 'Preorder', 'binary-tree-preorder', 'Easy', 'O(n)', 'O(h)'),
              lesson('bt-inorder', 'Inorder', 'binary-tree-inorder', 'Easy', 'O(n)', 'O(h)'),
              lesson('bt-postorder', 'Postorder', 'binary-tree-postorder', 'Easy', 'O(n)', 'O(h)'),
            ],
            Medium: [
              lesson('bt-level', 'Level Order', 'binary-tree-level-order', 'Medium', 'O(n)', 'O(n)'),
              lesson('bt-height', 'Height', 'binary-tree-height', 'Medium', 'O(n)', 'O(h)'),
              lesson('bt-diameter', 'Diameter', 'binary-tree-diameter', 'Medium', 'O(n)', 'O(h)'),
              lesson('bt-balanced', 'Check Balanced', 'binary-tree-check-balanced', 'Medium', 'O(n)', 'O(h)'),
            ],
            Hard: [
              lesson('bt-lca', 'Lowest Common Ancestor', 'binary-tree-lowest-common-ancestor', 'Hard', 'O(n)', 'O(h)'),
              lesson('bt-serialize', 'Serialize/Deserialize', 'binary-tree-serialize-deserialize', 'Hard', 'O(n)', 'O(n)'),
              lesson('bt-max-path', 'Maximum Path Sum', 'binary-tree-maximum-path-sum', 'Hard', 'O(n)', 'O(h)'),
              lesson('bt-cameras', 'Binary Tree Cameras', 'binary-tree-cameras', 'Hard', 'O(n)', 'O(h)'),
              lesson('bt-recover', 'Recover Tree', 'binary-tree-recover', 'Hard', 'O(n)', 'O(h)'),
            ],
          },
        },
        {
          id: 'bst',
          name: 'BST',
          description: 'Ordered binary trees with search, insert, and validation.',
          lessons: {
            Easy: [
              lesson('bst-insert', 'Insert', 'bst-insert-node', 'Easy', 'O(h)', 'O(1)'),
              lesson('bst-search', 'Search', 'bst-search-node', 'Easy', 'O(h)', 'O(1)'),
              lesson('bst-delete', 'Delete', 'bst-delete-node', 'Easy', 'O(h)', 'O(1)'),
            ],
            Medium: [
              lesson('bst-min', 'Minimum', 'bst-minimum-node', 'Medium', 'O(h)', 'O(1)'),
              lesson('bst-max', 'Maximum', 'bst-maximum-node', 'Medium', 'O(h)', 'O(1)'),
              lesson('bst-validate', 'Validate', 'bst-validate', 'Medium', 'O(n)', 'O(h)'),
              lesson('bst-kth', 'Kth Smallest', 'bst-kth-smallest', 'Medium', 'O(h+k)', 'O(h)'),
            ],
            Hard: [
              lesson('bst-iterator', 'Iterator', 'bst-iterator', 'Hard', 'O(1) avg', 'O(h)'),
              lesson('bst-sorted-array', 'Sorted Array to BST', 'bst-convert-sorted-array', 'Hard', 'O(n)', 'O(n)'),
              lesson('bst-lca', 'LCA', 'bst-lowest-common-ancestor', 'Hard', 'O(h)', 'O(1)'),
              lesson('bst-recover', 'Recover BST', 'bst-recover', 'Hard', 'O(n)', 'O(h)'),
              lesson('bst-merge', 'Merge BSTs', 'bst-merge', 'Hard', 'O(n1+n2)', 'O(h)'),
            ],
          },
        },
        {
          id: 'heap',
          name: 'Heap',
          description: 'Priority queues for top-K, merging, and streaming medians.',
          lessons: {
            Easy: [
              lesson('heap-basics', 'Heap Basics', 'heap-basics', 'Easy', 'O(1)', 'O(n)'),
              lesson('heap-min', 'Create Min Heap', 'heap-create-min', 'Easy', 'O(n)', 'O(n)'),
              lesson('heap-max', 'Create Max Heap', 'heap-create-max', 'Easy', 'O(n)', 'O(n)'),
            ],
            Medium: [
              lesson('heap-insert', 'Insert', 'heap-insert-element', 'Medium', 'O(log n)', 'O(1)'),
              lesson('heap-remove', 'Remove', 'heap-remove-element', 'Medium', 'O(log n)', 'O(1)'),
              lesson('heap-heapify', 'Heapify', 'heap-heapify', 'Medium', 'O(n)', 'O(1)'),
              lesson('heap-k-largest', 'K Largest', 'heap-k-largest', 'Medium', 'O(n log k)', 'O(k)'),
            ],
            Hard: [
              lesson('heap-k-smallest', 'K Smallest', 'heap-k-smallest', 'Hard', 'O(n log k)', 'O(k)'),
              lesson('heap-merge-k', 'Merge K Sorted', 'heap-merge-k-sorted-arrays', 'Hard', 'O(n log k)', 'O(n)'),
              lesson('heap-top-k-freq', 'Top K Frequent', 'heap-top-k-frequent', 'Hard', 'O(n log k)', 'O(n)'),
              lesson('heap-median', 'Median Stream', 'heap-median-from-stream', 'Hard', 'O(log n)', 'O(n)'),
              lesson('heap-min-cost', 'Minimum Cost', 'heap-minimum-cost', 'Hard', 'O(n log n)', 'O(n)'),
            ],
          },
        },
        {
          id: 'trie',
          name: 'Trie',
          description: 'Prefix trees for autocomplete, dictionary, and XOR problems.',
          lessons: {
            Easy: [
              lesson('trie-create', 'Create', 'trie-create', 'Easy', 'O(1)', 'O(1)'),
              lesson('trie-insert', 'Insert Word', 'trie-insert-word', 'Easy', 'O(m)', 'O(m)'),
              lesson('trie-search', 'Search Word', 'trie-search-word', 'Easy', 'O(m)', 'O(1)'),
            ],
            Medium: [
              lesson('trie-prefix', 'Prefix Search', 'trie-prefix-search', 'Medium', 'O(m)', 'O(1)'),
              lesson('trie-autocomplete', 'Auto Complete', 'trie-auto-complete', 'Medium', 'O(m+k)', 'O(k)'),
              lesson('trie-dictionary', 'Word Dictionary', 'trie-word-dictionary', 'Medium', 'O(n·m)', 'O(n·m)'),
              lesson('trie-replace', 'Replace Words', 'trie-replace-words', 'Medium', 'O(n·m)', 'O(n·m)'),
            ],
            Hard: [
              lesson('trie-lcp', 'Longest Common Prefix', 'trie-longest-common-prefix', 'Hard', 'O(n·m)', 'O(n·m)'),
              lesson('trie-word-search-ii', 'Word Search II', 'trie-word-search-ii', 'Hard', 'O(m·n·4^L)', 'O(n·m)'),
              lesson('trie-max-xor', 'Maximum XOR', 'trie-maximum-xor', 'Hard', 'O(n·b)', 'O(n·b)'),
              lesson('trie-palindrome', 'Palindrome Pairs', 'trie-palindrome-pairs', 'Hard', 'O(n·k²)', 'O(n·k)'),
            ],
          },
        },
      ],
      Advanced: [
        {
          id: 'graph',
          name: 'Graph',
          description: 'Vertices, edges, traversals, and shortest path algorithms.',
          lessons: {
            Easy: [
              lesson('graph-create', 'Create Graph', 'graph-create', 'Easy', 'O(V+E)', 'O(V+E)'),
              lesson('graph-add-vertex', 'Add Vertex', 'graph-add-vertex', 'Easy', 'O(1)', 'O(1)'),
              lesson('graph-add-edge', 'Add Edge', 'graph-add-edge', 'Easy', 'O(1)', 'O(1)'),
            ],
            Medium: [
              lesson('graph-bfs', 'BFS', 'graph-bfs', 'Medium', 'O(V+E)', 'O(V)'),
              lesson('graph-dfs', 'DFS', 'graph-dfs', 'Medium', 'O(V+E)', 'O(V)'),
              lesson('graph-cycle', 'Detect Cycle', 'graph-detect-cycle', 'Medium', 'O(V+E)', 'O(V)'),
              lesson('graph-topo', 'Topological Sort', 'graph-topological-sort', 'Medium', 'O(V+E)', 'O(V)'),
            ],
            Hard: [
              lesson('graph-dijkstra', 'Dijkstra', 'graph-dijkstra', 'Hard', 'O(E log V)', 'O(V)'),
              lesson('graph-bellman', 'Bellman-Ford', 'graph-bellman-ford', 'Hard', 'O(V·E)', 'O(V)'),
              lesson('graph-islands', 'Number of Islands', 'graph-number-of-islands', 'Hard', 'O(V+E)', 'O(V)'),
              lesson('graph-components', 'Connected Components', 'graph-connected-components', 'Hard', 'O(V+E)', 'O(V)'),
              lesson('graph-prim', 'Prim MST', 'graph-prim', 'Hard', 'O(E log V)', 'O(V)'),
            ],
          },
        },
        {
          id: 'dsu',
          name: 'Disjoint Set Union',
          description: 'Union-find for connectivity and MST foundations.',
          lessons: {
            Easy: [
              lesson('dsu-create', 'Create', 'dsu-create', 'Easy', 'O(n)', 'O(n)'),
              lesson('dsu-find', 'Find', 'dsu-find', 'Easy', 'O(α(n))', 'O(1)'),
              lesson('dsu-union', 'Union', 'dsu-union', 'Easy', 'O(α(n))', 'O(1)'),
            ],
            Medium: [
              lesson('dsu-connected', 'Connected Check', 'dsu-connected-check', 'Medium', 'O(α(n))', 'O(1)'),
              lesson('dsu-path-compress', 'Path Compression', 'dsu-path-compression', 'Medium', 'O(α(n))', 'O(1)'),
              lesson('dsu-union-rank', 'Union by Rank', 'dsu-union-by-rank', 'Medium', 'O(α(n))', 'O(1)'),
              lesson('dsu-cycle', 'Detect Cycle', 'dsu-detect-cycle', 'Medium', 'O(E·α(V))', 'O(V)'),
            ],
            Hard: [
              lesson('dsu-provinces', 'Number of Provinces', 'dsu-number-of-provinces', 'Hard', 'O(n²·α(n))', 'O(n)'),
              lesson('dsu-kruskal', 'Kruskal MST', 'dsu-kruskal-mst', 'Hard', 'O(E log E)', 'O(V)'),
              lesson('dsu-accounts', 'Accounts Merge', 'dsu-accounts-merge', 'Hard', 'O(n·k·α(n))', 'O(n·k)'),
              lesson('dsu-redundant', 'Redundant Connection', 'dsu-redundant-connection', 'Hard', 'O(n·α(n))', 'O(n)'),
              lesson('dsu-dynamic', 'Dynamic Connectivity', 'dsu-dynamic-connectivity', 'Hard', 'O(α(n))', 'O(n)'),
            ],
          },
        },
        {
          id: 'segment-tree',
          name: 'Segment Tree',
          description: 'Range queries and updates in logarithmic time.',
          lessons: {
            Easy: [
              lesson('seg-create', 'Create', 'segment-tree-create', 'Easy', 'O(1)', 'O(1)'),
              lesson('seg-build', 'Build', 'segment-tree-build', 'Easy', 'O(n)', 'O(n)'),
              lesson('seg-range-sum', 'Range Sum', 'segment-tree-range-sum', 'Easy', 'O(log n)', 'O(n)'),
            ],
            Medium: [
              lesson('seg-point-update', 'Point Update', 'segment-tree-point-update', 'Medium', 'O(log n)', 'O(1)'),
              lesson('seg-range-min', 'Range Min', 'segment-tree-range-minimum', 'Medium', 'O(log n)', 'O(n)'),
              lesson('seg-range-max', 'Range Max', 'segment-tree-range-maximum', 'Medium', 'O(log n)', 'O(n)'),
              lesson('seg-lazy', 'Lazy Propagation', 'segment-tree-lazy-propagation', 'Medium', 'O(log n)', 'O(n)'),
            ],
            Hard: [
              lesson('seg-count', 'Count Queries', 'segment-tree-count-queries', 'Hard', 'O(log n)', 'O(n)'),
              lesson('seg-range-updates', 'Range Updates', 'segment-tree-range-updates', 'Hard', 'O(log n)', 'O(n)'),
              lesson('seg-persistent', 'Persistent', 'segment-tree-persistent', 'Hard', 'O(log n)', 'O(n log n)'),
              lesson('seg-dynamic', 'Dynamic', 'segment-tree-dynamic', 'Hard', 'O(log n)', 'O(n)'),
              lesson('seg-merge-sort', 'Merge Sort Tree', 'segment-tree-merge-sort-tree', 'Hard', 'O(log² n)', 'O(n log n)'),
            ],
          },
        },
        {
          id: 'avl-tree',
          name: 'AVL Tree',
          description: 'Self-balancing BST with rotations.',
          lessons: {
            Easy: [
              lesson('avl-create', 'Create', 'avl-create', 'Easy', 'O(1)', 'O(1)'),
              lesson('avl-insert', 'Insert', 'avl-insert-node', 'Easy', 'O(log n)', 'O(1)'),
              lesson('avl-search', 'Search', 'avl-search-node', 'Easy', 'O(log n)', 'O(1)'),
            ],
            Medium: [
              lesson('avl-height', 'Height Calculation', 'avl-height-calculation', 'Medium', 'O(n)', 'O(h)'),
              lesson('avl-balance', 'Balance Factor', 'avl-balance-factor', 'Medium', 'O(1)', 'O(1)'),
              lesson('avl-left-rot', 'Left Rotation', 'avl-left-rotation', 'Medium', 'O(1)', 'O(1)'),
              lesson('avl-right-rot', 'Right Rotation', 'avl-right-rotation', 'Medium', 'O(1)', 'O(1)'),
            ],
            Hard: [
              lesson('avl-lr', 'LR Rotation', 'avl-lr-rotation', 'Hard', 'O(1)', 'O(1)'),
              lesson('avl-rl', 'RL Rotation', 'avl-rl-rotation', 'Hard', 'O(1)', 'O(1)'),
              lesson('avl-delete', 'Delete', 'avl-delete-node', 'Hard', 'O(log n)', 'O(1)'),
              lesson('avl-join', 'Join', 'avl-join', 'Hard', 'O(log n)', 'O(1)'),
              lesson('avl-split', 'Split', 'avl-split', 'Hard', 'O(log n)', 'O(1)'),
            ],
          },
        },
      ],
    },
  },
  {
    id: 'algorithms',
    title: 'Algorithms',
    description: 'Sorting, searching, recursion, graphs, DP, and more.',
    topics: {
      Beginner: [
        {
          id: 'sorting',
          name: 'Sorting',
          description: 'Classic and advanced sorting techniques.',
          lessons: {
            Easy: [
              lesson('sort-bubble', 'Bubble Sort', 'sorting-bubble', 'Easy', 'O(n²)', 'O(1)'),
              lesson('sort-selection', 'Selection Sort', 'sorting-selection', 'Easy', 'O(n²)', 'O(1)'),
              lesson('sort-insertion', 'Insertion Sort', 'sorting-insertion', 'Easy', 'O(n²)', 'O(1)'),
            ],
            Medium: [
              lesson('sort-merge', 'Merge Sort', 'sorting-merge', 'Medium', 'O(n log n)', 'O(n)'),
              lesson('sort-quick', 'Quick Sort', 'sorting-quick', 'Medium', 'O(n log n)', 'O(log n)'),
              lesson('sort-heap', 'Heap Sort', 'sorting-heap', 'Medium', 'O(n log n)', 'O(1)'),
              lesson('sort-shell', 'Shell Sort', 'sorting-shell', 'Medium', 'O(n^1.3)', 'O(1)'),
            ],
            Hard: [
              lesson('sort-counting', 'Counting Sort', 'sorting-counting', 'Hard', 'O(n+k)', 'O(k)'),
              lesson('sort-radix', 'Radix Sort', 'sorting-radix', 'Hard', 'O(d·n)', 'O(n+d)'),
              lesson('sort-bucket', 'Bucket Sort', 'sorting-bucket', 'Hard', 'O(n)', 'O(n)'),
              lesson('sort-tim', 'Tim Sort', 'sorting-tim', 'Hard', 'O(n log n)', 'O(n)'),
              lesson('sort-intro', 'Intro Sort', 'sorting-intro', 'Hard', 'O(n log n)', 'O(log n)'),
            ],
          },
        },
        {
          id: 'searching',
          name: 'Searching',
          description: 'Linear, binary, and advanced search strategies.',
          lessons: {
            Easy: [
              lesson('search-linear', 'Linear Search', 'searching-linear', 'Easy', 'O(n)', 'O(1)'),
              lesson('search-binary', 'Binary Search', 'searching-binary', 'Easy', 'O(log n)', 'O(1)'),
            ],
            Medium: [
              lesson('search-jump', 'Jump Search', 'searching-jump', 'Medium', 'O(√n)', 'O(1)'),
              lesson('search-exp', 'Exponential Search', 'searching-exponential', 'Medium', 'O(log n)', 'O(1)'),
              lesson('search-interp', 'Interpolation Search', 'searching-interpolation', 'Medium', 'O(log log n)', 'O(1)'),
              lesson('search-ternary', 'Ternary Search', 'searching-ternary', 'Medium', 'O(log n)', 'O(1)'),
            ],
            Hard: [
              lesson('search-rotated', 'Search Rotated Array', 'searching-rotated-array', 'Hard', 'O(log n)', 'O(1)'),
              lesson('search-peak', 'Find Peak Element', 'searching-peak-element', 'Hard', 'O(log n)', 'O(1)'),
              lesson('search-median', 'Median Two Arrays', 'searching-median-two-arrays', 'Hard', 'O(log(min(m,n)))', 'O(1)'),
              lesson('search-bsoa', 'Binary Search on Answer', 'searching-binary-on-answer', 'Hard', 'O(n log M)', 'O(1)'),
            ],
          },
        },
        {
          id: 'recursion',
          name: 'Recursion',
          description: 'Recursive thinking from basics to backtracking classics.',
          lessons: {
            Easy: [
              lesson('rec-print', 'Print Numbers', 'recursion-print-numbers', 'Easy', 'O(n)', 'O(n)'),
              lesson('rec-factorial', 'Factorial', 'recursion-factorial', 'Easy', 'O(n)', 'O(n)'),
              lesson('rec-fibonacci', 'Fibonacci', 'recursion-fibonacci', 'Easy', 'O(2^n)', 'O(n)'),
              lesson('rec-sum-array', 'Sum of Array', 'recursion-sum-of-array', 'Easy', 'O(n)', 'O(n)'),
              lesson('rec-reverse-str', 'Reverse String', 'recursion-reverse-string', 'Easy', 'O(n)', 'O(n)'),
            ],
            Medium: [
              lesson('rec-subsets', 'Generate Subsets', 'recursion-generate-subsets', 'Medium', 'O(2^n)', 'O(n)'),
              lesson('rec-perms', 'Generate Permutations', 'recursion-generate-permutations', 'Medium', 'O(n!)', 'O(n)'),
              lesson('rec-hanoi', 'Tower of Hanoi', 'recursion-tower-of-hanoi', 'Medium', 'O(2^n)', 'O(n)'),
              lesson('rec-bin-search', 'Recursive Binary Search', 'recursion-binary-search', 'Medium', 'O(log n)', 'O(log n)'),
            ],
            Hard: [
              lesson('rec-n-queens', 'N Queens', 'recursion-n-queens', 'Hard', 'O(n!)', 'O(n)'),
              lesson('rec-sudoku', 'Sudoku Solver', 'recursion-sudoku-solver', 'Hard', 'O(9^m)', 'O(1)'),
              lesson('rec-word-search', 'Word Search', 'recursion-word-search', 'Hard', 'O(m·n·4^L)', 'O(L)'),
            ],
          },
        },
      ],
      Intermediate: [
        {
          id: 'backtracking',
          name: 'Backtracking',
          description: 'Explore decision trees with pruning.',
          lessons: {
            Easy: [
              lesson('bt-subsets', 'Subsets', 'backtracking-subsets', 'Easy', 'O(2^n)', 'O(n)'),
              lesson('bt-letters', 'Letter Combinations', 'backtracking-letter-combinations', 'Easy', 'O(4^n)', 'O(n)'),
              lesson('bt-parens', 'Generate Parentheses', 'backtracking-generate-parentheses', 'Easy', 'O(4^n/√n)', 'O(n)'),
            ],
            Medium: [
              lesson('bt-combo-sum', 'Combination Sum', 'backtracking-combination-sum', 'Medium', 'O(2^n)', 'O(n)'),
              lesson('bt-perms', 'Permutations', 'backtracking-permutations', 'Medium', 'O(n!)', 'O(n)'),
              lesson('bt-word-search', 'Word Search', 'backtracking-word-search', 'Medium', 'O(m·n·4^L)', 'O(L)'),
              lesson('bt-pal-part', 'Palindrome Partitioning', 'backtracking-palindrome-partitioning', 'Medium', 'O(n·2^n)', 'O(n)'),
            ],
            Hard: [
              lesson('bt-n-queens', 'N Queens', 'backtracking-n-queens', 'Hard', 'O(n!)', 'O(n)'),
              lesson('bt-sudoku', 'Sudoku Solver', 'backtracking-sudoku-solver', 'Hard', 'O(9^m)', 'O(1)'),
              lesson('bt-crossword', 'Crossword Solver', 'backtracking-crossword-solver', 'Hard', 'O(W·L)', 'O(W·L)'),
            ],
          },
        },
        {
          id: 'tree-algorithms',
          name: 'Tree Algorithms',
          description: 'Traversal, LCA, and tree optimization problems.',
          lessons: {
            Easy: [
              lesson('tree-dfs', 'DFS Traversal', 'tree-dfs-traversal', 'Easy', 'O(n)', 'O(h)'),
              lesson('tree-bfs', 'BFS Traversal', 'tree-bfs-traversal', 'Easy', 'O(n)', 'O(n)'),
              lesson('tree-height', 'Tree Height', 'tree-height', 'Easy', 'O(n)', 'O(h)'),
              lesson('tree-count', 'Count Nodes', 'tree-count-nodes', 'Easy', 'O(n)', 'O(h)'),
            ],
            Medium: [
              lesson('tree-diameter', 'Diameter', 'tree-diameter', 'Medium', 'O(n)', 'O(h)'),
              lesson('tree-lca', 'Lowest Common Ancestor', 'tree-lca', 'Medium', 'O(n)', 'O(h)'),
              lesson('tree-zigzag', 'Zigzag Traversal', 'tree-zigzag', 'Medium', 'O(n)', 'O(n)'),
              lesson('tree-boundary', 'Boundary Traversal', 'tree-boundary', 'Medium', 'O(n)', 'O(h)'),
            ],
            Hard: [
              lesson('tree-serialize', 'Serialize/Deserialize', 'tree-serialize', 'Hard', 'O(n)', 'O(n)'),
              lesson('tree-max-path', 'Maximum Path Sum', 'tree-max-path-sum', 'Hard', 'O(n)', 'O(h)'),
              lesson('tree-recover', 'Recover Tree', 'tree-recover', 'Hard', 'O(n)', 'O(h)'),
            ],
          },
        },
        {
          id: 'greedy',
          name: 'Greedy',
          description: 'Locally optimal choices for global solutions.',
          lessons: {
            Easy: [
              lesson('greedy-activity', 'Activity Selection', 'greedy-activity-selection', 'Easy', 'O(n log n)', 'O(1)'),
              lesson('greedy-cookies', 'Assign Cookies', 'greedy-assign-cookies', 'Easy', 'O(n log n)', 'O(1)'),
              lesson('greedy-lemonade', 'Lemonade Change', 'greedy-lemonade-change', 'Easy', 'O(n)', 'O(1)'),
            ],
            Medium: [
              lesson('greedy-jump', 'Jump Game', 'greedy-jump-game', 'Medium', 'O(n)', 'O(1)'),
              lesson('greedy-gas', 'Gas Station', 'greedy-gas-station', 'Medium', 'O(n)', 'O(1)'),
              lesson('greedy-job', 'Job Scheduling', 'greedy-job-scheduling', 'Medium', 'O(n log n)', 'O(n)'),
              lesson('greedy-knapsack', 'Fractional Knapsack', 'greedy-fractional-knapsack', 'Medium', 'O(n log n)', 'O(1)'),
            ],
            Hard: [
              lesson('greedy-huffman', 'Huffman Coding', 'greedy-huffman-coding', 'Hard', 'O(n log n)', 'O(n)'),
              lesson('greedy-platforms', 'Minimum Platforms', 'greedy-minimum-platforms', 'Hard', 'O(n log n)', 'O(1)'),
              lesson('greedy-candy', 'Candy Problem', 'greedy-candy-problem', 'Hard', 'O(n)', 'O(1)'),
            ],
          },
        },
      ],
      Advanced: [
        {
          id: 'graph-algorithms',
          name: 'Graph Algorithms',
          description: 'Shortest paths, MST, and advanced graph theory.',
          lessons: {
            Easy: [
              lesson('ga-bfs', 'BFS', 'graph-bfs', 'Easy', 'O(V+E)', 'O(V)'),
              lesson('ga-dfs', 'DFS', 'graph-dfs', 'Easy', 'O(V+E)', 'O(V)'),
              lesson('ga-components', 'Connected Components', 'graph-connected-components', 'Easy', 'O(V+E)', 'O(V)'),
            ],
            Medium: [
              lesson('ga-topo', 'Topological Sort', 'graph-topological-sort', 'Medium', 'O(V+E)', 'O(V)'),
              lesson('ga-cycle', 'Detect Cycle', 'graph-detect-cycle', 'Medium', 'O(V+E)', 'O(V)'),
              lesson('ga-dijkstra', 'Dijkstra', 'graph-dijkstra', 'Medium', 'O(E log V)', 'O(V)'),
              lesson('ga-bellman', 'Bellman-Ford', 'graph-bellman-ford', 'Medium', 'O(V·E)', 'O(V)'),
            ],
            Hard: [
              lesson('ga-floyd', 'Floyd-Warshall', 'graph-floyd-warshall', 'Hard', 'O(V³)', 'O(V²)'),
              lesson('ga-astar', 'A* Search', 'graph-a-star', 'Hard', 'O(E)', 'O(V)'),
              lesson('ga-tarjan', 'Tarjan', 'graph-tarjan', 'Hard', 'O(V+E)', 'O(V)'),
              lesson('ga-prim', 'Prim', 'graph-prim', 'Hard', 'O(E log V)', 'O(V)'),
              lesson('ga-kruskal', 'Kruskal', 'graph-kruskal', 'Hard', 'O(E log E)', 'O(V)'),
            ],
          },
        },
        {
          id: 'dynamic-programming',
          name: 'Dynamic Programming',
          description: 'Optimal substructure and overlapping subproblems.',
          lessons: {
            Easy: [
              lesson('dp-fib', 'Fibonacci DP', 'dp-fibonacci', 'Easy', 'O(n)', 'O(1)'),
              lesson('dp-stairs', 'Climbing Stairs', 'dp-climbing-stairs', 'Easy', 'O(n)', 'O(1)'),
              lesson('dp-min-cost', 'Min Cost Climbing', 'dp-min-cost-climbing', 'Easy', 'O(n)', 'O(1)'),
            ],
            Medium: [
              lesson('dp-robber', 'House Robber', 'dp-house-robber', 'Medium', 'O(n)', 'O(1)'),
              lesson('dp-coin', 'Coin Change', 'dp-coin-change', 'Medium', 'O(n·A)', 'O(A)'),
              lesson('dp-lis', 'LIS', 'dp-lis', 'Medium', 'O(n log n)', 'O(n)'),
              lesson('dp-knapsack', 'Knapsack', 'dp-knapsack', 'Medium', 'O(n·W)', 'O(W)'),
            ],
            Hard: [
              lesson('dp-edit', 'Edit Distance', 'dp-edit-distance', 'Hard', 'O(m·n)', 'O(m·n)'),
              lesson('dp-lcs', 'LCS', 'dp-lcs', 'Hard', 'O(m·n)', 'O(m·n)'),
              lesson('dp-matrix', 'Matrix Chain', 'dp-matrix-chain', 'Hard', 'O(n³)', 'O(n²)'),
              lesson('dp-burst', 'Burst Balloons', 'dp-burst-balloons', 'Hard', 'O(n³)', 'O(n²)'),
            ],
          },
        },
        {
          id: 'bit-algorithms',
          name: 'Bit Algorithms',
          description: 'Bitwise tricks, masks, and DP on subsets.',
          lessons: {
            Easy: [
              lesson('bit-aox', 'AND / OR / XOR', 'bit-and-or-xor', 'Easy', 'O(1)', 'O(1)'),
              lesson('bit-even-odd', 'Check Even/Odd', 'bit-check-even-odd', 'Easy', 'O(1)', 'O(1)'),
              lesson('bit-pow2', 'Power of Two', 'bit-power-of-two', 'Easy', 'O(1)', 'O(1)'),
              lesson('bit-count', 'Count Bits', 'bit-count-bits', 'Easy', 'O(log n)', 'O(1)'),
            ],
            Medium: [
              lesson('bit-single', 'Single Number', 'bit-single-number', 'Medium', 'O(n)', 'O(1)'),
              lesson('bit-subsets', 'Subsets Using Bits', 'bit-subsets', 'Medium', 'O(2^n)', 'O(1)'),
              lesson('bit-mask', 'Bit Masking', 'bit-masking', 'Medium', 'O(n)', 'O(1)'),
            ],
            Hard: [
              lesson('bit-n-queens', 'N Queens Bitmask', 'bit-n-queens', 'Hard', 'O(n!)', 'O(n)'),
              lesson('bit-tsp', 'Traveling Salesman DP', 'bit-tsp', 'Hard', 'O(n²·2^n)', 'O(2^n)'),
              lesson('bit-max-xor', 'Maximum XOR', 'bit-maximum-xor', 'Hard', 'O(n·b)', 'O(n·b)'),
            ],
          },
        },
      ],
    },
  },
  {
    id: 'patterns',
    title: 'Patterns',
    description: 'Reusable problem-solving patterns mapped to visual lessons.',
    topics: {
      Beginner: [
        {
          id: 'two-pointers',
          name: 'Two Pointers',
          description: 'Opposite ends and slow/fast pointer techniques.',
          lessons: {
            Easy: [
              lesson('pat-two-sum', 'Two Sum (Sorted)', 'array-two-sum-sorted', 'Easy', 'O(n)', 'O(1)'),
              lesson('pat-reverse', 'Reverse Array', 'array-reverse', 'Easy', 'O(n)', 'O(1)'),
              lesson('pat-palindrome', 'Palindrome Check', 'string-palindrome-check', 'Easy', 'O(n)', 'O(1)'),
            ],
            Medium: [
              lesson('pat-remove-dup', 'Remove Duplicates (Sorted)', 'array-remove-duplicates-sorted', 'Medium', 'O(n)', 'O(1)'),
              lesson('pat-dutch', 'Dutch Flag', 'array-dutch-flag', 'Medium', 'O(n)', 'O(1)'),
              lesson('pat-merge-sorted', 'Merge Sorted', 'array-merge-sorted', 'Medium', 'O(n+m)', 'O(1)'),
            ],
            Hard: [
              lesson('pat-rain', 'Trapping Rain Water', 'array-rain-water', 'Hard', 'O(n)', 'O(1)'),
              lesson('pat-intervals', 'Merge Intervals', 'array-merge-intervals', 'Hard', 'O(n log n)', 'O(n)'),
              lesson('pat-three-sum', 'Three Sum', 'array-three-sum', 'Hard', 'O(n²)', 'O(1)'),
            ],
          },
        },
        {
          id: 'sliding-window',
          name: 'Sliding Window',
          description: 'Fixed and variable window optimization.',
          lessons: {
            Easy: [
              lesson('pat-prefix', 'Prefix Sum', 'array-prefix-sum', 'Easy', 'O(n)', 'O(n)'),
              lesson('pat-kadane', 'Max Subarray', 'array-kadane', 'Easy', 'O(n)', 'O(1)'),
            ],
            Medium: [
              lesson('pat-sw-max', 'Sliding Window Max', 'queue-sliding-window-maximum', 'Medium', 'O(n)', 'O(k)'),
              lesson('pat-min-window', 'Minimum Window', 'string-minimum-window-substring', 'Medium', 'O(n)', 'O(1)'),
              lesson('pat-subarray-k', 'Subarray Sum K', 'hashmap-subarray-sum-equals-k', 'Medium', 'O(n)', 'O(n)'),
            ],
            Hard: [
              lesson('pat-longest-unique', 'Longest Unique Substring', 'string-longest-unique-substring', 'Hard', 'O(n)', 'O(k)'),
              lesson('pat-anagrams', 'Count Anagrams', 'string-count-anagrams', 'Hard', 'O(n)', 'O(1)'),
              // Was 'pat-task-sched' (Task Scheduler): a greedy/heap problem, not a
              // window one. It stays in the Queue topic as 'queue-task-scheduler'.
              lesson('pat-sw-median', 'Sliding Window Median', 'heap-sliding-window-median', 'Hard', 'O(n log k)', 'O(k)'),
            ],
          },
        },
      ],
      Intermediate: [
        {
          id: 'fast-slow-pointer',
          name: 'Fast & Slow Pointer',
          description: 'Cycle detection and middle-finding patterns.',
          lessons: {
            Easy: [
              lesson('pat-ll-middle', 'Middle of List', 'linked-list-middle', 'Easy', 'O(n)', 'O(1)'),
            ],
            Medium: [
              lesson('pat-ll-cycle', 'Detect Cycle', 'linked-list-detect-cycle', 'Medium', 'O(n)', 'O(1)'),
              lesson('pat-ll-reverse', 'Reverse List', 'linked-list-reverse', 'Medium', 'O(n)', 'O(1)'),
            ],
            Hard: [
              lesson('pat-ll-k-group', 'Reverse K Group', 'linked-list-reverse-k-group', 'Hard', 'O(n)', 'O(1)'),
              lesson('pat-ll-merge-k', 'Merge K Lists', 'linked-list-merge-k-sorted', 'Hard', 'O(n log k)', 'O(1)'),
            ],
          },
        },
        {
          id: 'monotonic-stack',
          name: 'Monotonic Stack',
          description: 'Next greater/smaller element patterns.',
          lessons: {
            Easy: [
              lesson('pat-nge', 'Next Greater Element', 'stack-next-greater-element', 'Easy', 'O(n)', 'O(n)'),
            ],
            Medium: [
              lesson('pat-daily-temp', 'Daily Temperatures', 'stack-daily-temperatures', 'Medium', 'O(n)', 'O(n)'),
              lesson('pat-histogram', 'Largest Histogram', 'stack-largest-rectangle-histogram', 'Medium', 'O(n)', 'O(n)'),
            ],
            Hard: [
              lesson('pat-max-rect', 'Maximal Rectangle', 'stack-maximal-rectangle', 'Hard', 'O(rows·cols)', 'O(cols)'),
            ],
          },
        },
      ],
      Advanced: [
        {
          id: 'graph-patterns',
          name: 'Graph Patterns',
          description: 'BFS/DFS, shortest path, and connectivity patterns.',
          lessons: {
            Easy: [
              lesson('pat-bfs', 'BFS Pattern', 'graph-bfs', 'Easy', 'O(V+E)', 'O(V)'),
              lesson('pat-dfs', 'DFS Pattern', 'graph-dfs', 'Easy', 'O(V+E)', 'O(V)'),
            ],
            Medium: [
              lesson('pat-topo', 'Topological Sort', 'graph-topological-sort', 'Medium', 'O(V+E)', 'O(V)'),
              lesson('pat-dijkstra', 'Dijkstra Pattern', 'graph-dijkstra', 'Medium', 'O(E log V)', 'O(V)'),
            ],
            Hard: [
              lesson('pat-floyd', 'All Pairs Shortest', 'graph-floyd-warshall', 'Hard', 'O(V³)', 'O(V²)'),
              lesson('pat-astar', 'A* Pattern', 'graph-a-star', 'Hard', 'O(E)', 'O(V)'),
            ],
          },
        },
      ],
    },
  },
];

export const levels: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
export const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export function getTrack(id: TrackId): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getTopic(trackId: TrackId, level: Level, topicId: string): Topic | undefined {
  return getTrack(trackId)?.topics[level]?.find((t) => t.id === topicId);
}

export function getAllLessons(): Lesson[] {
  const all: Lesson[] = [];
  for (const track of tracks) {
    for (const level of levels) {
      for (const topic of track.topics[level] ?? []) {
        for (const diff of difficulties) {
          all.push(...(topic.lessons[diff] ?? []));
        }
      }
    }
  }
  return all;
}

export interface LessonContext {
  lesson: Lesson;
  track: Track;
  level: Level;
  topic: Topic;
}

/** A lesson and where it sits. Lesson ids are unique; algorithm ids are not. */
export function findLessonById(lessonId: string): LessonContext | null {
  for (const track of tracks) {
    for (const level of levels) {
      for (const topic of track.topics[level] ?? []) {
        for (const diff of difficulties) {
          const found = topic.lessons[diff]?.find((l) => l.id === lessonId);
          if (found) return { lesson: found, track, level, topic };
        }
      }
    }
  }
  return null;
}

/** Breadcrumb labels for a lesson: track, level, topic, lesson. */
export function getLessonPathById(lessonId: string): string[] {
  const ctx = findLessonById(lessonId);
  if (!ctx) return [];
  return [ctx.track.title, ctx.level, ctx.topic.name, ctx.lesson.name];
}

/**
 * First lesson using an algorithm. Several tracks reuse the same algorithm,
 * so this is only for resolving old /visualizer/<algorithmId> links; route
 * and look lessons up by id everywhere else.
 */
export function findLessonByAlgorithmId(algorithmId: string): {
  lesson: Lesson;
  track: Track;
  level: Level;
  topic: Topic;
} | null {
  for (const track of tracks) {
    for (const level of levels) {
      for (const topic of track.topics[level] ?? []) {
        for (const diff of difficulties) {
          const found = topic.lessons[diff]?.find((l) => l.algorithmId === algorithmId);
          if (found) return { lesson: found, track, level, topic };
        }
      }
    }
  }
  return null;
}

export function getLessonPath(algorithmId: string): string[] {
  const ctx = findLessonByAlgorithmId(algorithmId);
  if (!ctx) return [];
  return [ctx.track.title, ctx.level, ctx.topic.name, ctx.lesson.name];
}
