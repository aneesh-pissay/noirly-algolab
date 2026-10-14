import { tracks, levels, difficulties, type TrackId, type Level } from './curriculum';

export interface TrackTheory {
  overview: string;
  whyItMatters: string[];
  pathOverview: string;
}

export interface LevelTheory {
  overview: string;
  focus: string[];
  tip: string;
}

export interface TopicTheory {
  overview: string;
  keyConcepts: string[];
  realWorld: string[];
  studyTip: string;
}

export const trackTheory: Record<TrackId, TrackTheory> = {
  'data-structures': {
    overview:
      'Data structures are the foundation of every program. They define how information is stored, accessed, and updated — and directly determine whether your solution is fast or slow.',
    whyItMatters: [
      'Interview questions test whether you pick the right structure for the job',
      'Arrays, hash maps, trees, and graphs appear in almost every real codebase',
      'Understanding trade-offs (time vs space) is what separates junior from senior engineers',
    ],
    pathOverview:
      'Start with arrays and strings, move through hash-based structures and linear collections, then tackle trees, heaps, and advanced structures like segment trees.',
  },
  algorithms: {
    overview:
      'Algorithms are step-by-step procedures for solving problems. From sorting a list to finding the shortest path in a graph, algorithms turn raw data into useful results.',
    whyItMatters: [
      'Sorting and searching are building blocks for thousands of other algorithms',
      'Recursion and DP teach you to break complex problems into smaller sub-problems',
      'Graph and greedy algorithms power routing, recommendations, and scheduling systems',
    ],
    pathOverview:
      'Begin with sorting, searching, and recursion. Progress to backtracking, trees, greedy methods, and bit manipulation. Finish with graph algorithms, dynamic programming, string algorithms, and advanced binary search.',
  },
  patterns: {
    overview:
      'Patterns are reusable problem-solving templates. Once you recognize a pattern, you can solve dozens of variations without starting from scratch.',
    whyItMatters: [
      'Most coding interview problems map to 10–15 core patterns',
      'Two pointers and sliding window alone cover hundreds of array/string problems',
      'Pattern recognition cuts problem-solving time dramatically',
    ],
    pathOverview:
      'Master two pointers, sliding window, and fast/slow pointers first, then monotonic stacks.',
  },
};

export const levelTheory: Record<Level, LevelTheory> = {
  Beginner: {
    overview:
      'Build your foundation. These topics cover the essential structures and techniques every developer must know before tackling harder material.',
    focus: [
      'Core operations: insert, delete, search, traverse',
      'Time and space complexity intuition',
      'Step-by-step visualizations to build mental models',
    ],
    tip: 'Easy lessons unlock Medium, then Hard. Finishing a topic’s Easy and Medium lessons opens the next topic; Intermediate opens once every Beginner topic in every track is done.',
  },
  Intermediate: {
    overview:
      'Apply fundamentals to real problem types. You will combine multiple structures and start optimizing for performance.',
    focus: [
      'Multi-step algorithms and compound data structures',
      'Pattern recognition across similar problems',
      'Balancing readability with efficiency',
    ],
    tip: 'Revisit Beginner topics if a lesson feels unclear — intermediate builds directly on those concepts.',
  },
  Advanced: {
    overview:
      'Tackle specialized structures and algorithms used in competitive programming, systems design, and senior-level interviews.',
    focus: [
      'Self-balancing trees, segment trees, and union-find',
      'NP-hard problems, bitmask DP, and graph optimizations',
      'Amortized analysis and advanced trade-offs',
    ],
    tip: 'Advanced lessons assume comfort with everything in Beginner and Intermediate — do not skip ahead.',
  },
};

const topicTheoryMap: Record<string, TopicTheory> = {
  arrays: {
    overview:
      'Arrays store elements in contiguous memory with O(1) index access. Most DSA journeys start here because arrays underpin strings, matrices, and dynamic lists.',
    keyConcepts: ['Index-based access', 'In-place mutation', 'Two-pointer techniques', 'Prefix sums'],
    realWorld: ['Image pixel buffers', 'Game entity lists', 'Database row storage', 'Sensor time-series data'],
    studyTip: 'Draw the array on paper and trace pointer movement before running the visualizer.',
  },
  strings: {
    overview:
      'Strings are character arrays with unique constraints: immutability (in many languages), Unicode encoding, and substring/search operations.',
    keyConcepts: ['Character frequency maps', 'Two-pointer palindrome checks', 'Substring search', 'String builders'],
    realWorld: ['Text editors', 'Search engines', 'DNA sequence analysis', 'Log parsing'],
    studyTip: 'Treat strings as arrays of characters — most array techniques apply with small adjustments.',
  },
  hashmap: {
    overview:
      'Hash maps provide average O(1) lookup, insert, and delete by mapping keys to array indices via a hash function.',
    keyConcepts: ['Hash functions', 'Collision handling', 'Frequency counting', 'Key-value caching'],
    realWorld: ['Dictionaries / objects', 'Database indexes', 'LRU caches', 'Session stores'],
    studyTip: 'Ask "Do I need fast lookup by value?" — if yes, reach for a hash map.',
  },
  hashset: {
    overview:
      'Hash sets store unique elements with O(1) average membership checks — ideal for deduplication and existence queries.',
    keyConcepts: ['Uniqueness enforcement', 'Set intersection/union', 'Cycle detection in sequences', 'Duplicate removal'],
    realWorld: ['Unique visitor tracking', 'Spam filters', 'Permission sets', 'Tag collections'],
    studyTip: 'Use a set when you only care whether something exists, not what value is stored with it.',
  },
  stack: {
    overview:
      'Stacks follow LIFO (Last In, First Out) — like a stack of plates. Push and pop happen at one end only.',
    keyConcepts: ['LIFO ordering', 'Call stack simulation', 'Parentheses matching', 'Monotonic stack'],
    realWorld: ['Undo/redo in editors', 'Browser back button', 'Expression evaluation', 'DFS traversal'],
    studyTip: 'When you see "nearest greater/smaller element" or nested structures, think stack.',
  },
  queue: {
    overview:
      'Queues follow FIFO (First In, First Out) — like a line at a store. Enqueue at rear, dequeue from front.',
    keyConcepts: ['FIFO ordering', 'BFS traversal', 'Circular buffers', 'Deque (double-ended queue)'],
    realWorld: ['Print job queues', 'Message brokers', 'Task schedulers', 'Rate limiters'],
    studyTip: 'BFS always uses a queue. Sliding window maximum often uses a monotonic deque.',
  },
  'linked-list': {
    overview:
      'Linked lists chain nodes together with pointers. Unlike arrays, insertion/deletion at a known position is O(1) — but random access is O(n).',
    keyConcepts: ['Node pointers', 'Dummy head technique', 'Fast/slow pointers', 'In-place reversal'],
    realWorld: ['Music playlists', 'Memory allocators', 'LRU cache chains', 'Polynomial arithmetic'],
    studyTip: 'Draw nodes as boxes with arrows — pointer manipulation is much easier visually.',
  },
  'binary-tree': {
    overview:
      'Binary trees branch into at most two children per node. They enable efficient search, sorting, and hierarchical data representation.',
    keyConcepts: ['Preorder/inorder/postorder traversal', 'Level-order (BFS)', 'Height and depth', 'Recursion on subtrees'],
    realWorld: ['File system hierarchies', 'DOM trees', 'Decision trees in ML', 'Expression parse trees'],
    studyTip: 'Every tree problem is a recursion problem — define what to do at the current node, then recurse.',
  },
  bst: {
    overview:
      'Binary Search Trees maintain sorted order: left child < parent < right child. This enables O(log n) search when balanced.',
    keyConcepts: ['BST invariant', 'Inorder = sorted order', 'Insert/delete preserving property', 'Validation'],
    realWorld: ['Ordered maps', 'Priority event queues', 'Database indexes', 'Autocomplete backends'],
    studyTip: 'Always ask: "Does the BST property still hold after this operation?"',
  },
  heap: {
    overview:
      'Heaps are complete binary trees satisfying the heap property — parent ≤ children (min-heap) or parent ≥ children (max-heap).',
    keyConcepts: ['Heapify O(n)', 'Extract-min/max O(log n)', 'K-largest/smallest', 'Priority queues'],
    realWorld: ['Task schedulers', 'Dijkstra\'s algorithm', 'Median finding', 'Event-driven simulations'],
    studyTip: 'When you need "top K" or "running median", heap is usually the answer.',
  },
  trie: {
    overview:
      'Tries (prefix trees) store strings character-by-character. Each path from root to node represents a prefix.',
    keyConcepts: ['Prefix search', 'Autocomplete', 'Word dictionary', 'XOR maximization with bits'],
    realWorld: ['Search autocomplete', 'IP routing tables', 'Spell checkers', 'Phone contact search'],
    studyTip: 'Tries shine when you need prefix matching or dictionary operations on many strings.',
  },
  graph: {
    overview:
      'Graphs model relationships between entities — nodes connected by edges. Social networks, maps, and dependencies are all graphs.',
    keyConcepts: ['Adjacency list vs matrix', 'BFS and DFS', 'Shortest paths', 'Connected components'],
    realWorld: ['Google Maps routing', 'Social friend suggestions', 'Circuit design', 'Dependency resolution'],
    studyTip: 'Decide directed vs undirected and weighted vs unweighted before picking an algorithm.',
  },
  dsu: {
    overview:
      'Disjoint Set Union (Union-Find) tracks partitioned elements with near-constant-time union and find via path compression.',
    keyConcepts: ['Union by rank', 'Path compression', 'Connected components', 'Kruskal\'s MST'],
    realWorld: ['Network connectivity', 'Image segmentation', 'Percolation simulations', 'Account merging'],
    studyTip: 'Use DSU whenever you need to merge groups and query if two items are in the same group.',
  },
  'segment-tree': {
    overview:
      'Segment trees answer range queries (sum, min, max) and point/range updates in O(log n) time.',
    keyConcepts: ['Range queries', 'Lazy propagation', 'Point updates', 'Merge sort tree'],
    realWorld: ['Database range aggregations', 'Competitive programming', 'Computational geometry', 'Time-series analytics'],
    studyTip: 'If brute force is O(n) per query and you have many queries, segment tree is the upgrade.',
  },
  'avl-tree': {
    overview:
      'AVL trees are self-balancing BSTs where left and right subtree heights differ by at most 1. Rotations restore balance after insert/delete.',
    keyConcepts: ['Balance factor', 'Single and double rotations', 'O(log n) guaranteed height', 'Rebalancing'],
    realWorld: ['Ordered maps needing guarantees', 'Database indexing', 'Real-time systems', 'Memory-constrained sorted storage'],
    studyTip: 'Watch rotations in the visualizer — LR and RL rotations fix double imbalances.',
  },
  sorting: {
    overview:
      'Sorting arranges elements in order. Different algorithms trade simplicity, speed, stability, and memory usage.',
    keyConcepts: ['Comparison vs non-comparison sorts', 'Stability', 'In-place vs extra space', 'Best/worst case analysis'],
    realWorld: ['Database ORDER BY', 'Search result ranking', 'Leaderboards', 'File system listings'],
    studyTip: 'Know when O(n²) is acceptable (tiny arrays) vs when you need O(n log n).',
  },
  searching: {
    overview:
      'Searching finds a target in a collection. Strategy depends on whether data is sorted, uniformly distributed, or unstructured.',
    keyConcepts: ['Linear scan', 'Binary search on sorted data', 'Search space reduction', 'Binary search on answer'],
    realWorld: ['Database index lookups', 'Autocomplete', 'Version control bisect', 'Resource allocation'],
    studyTip: 'Sorted array → binary search. Unsorted → hash map or linear scan.',
  },
  recursion: {
    overview:
      'Recursion solves problems by solving smaller instances of the same problem, with a base case to stop.',
    keyConcepts: ['Base case and recursive case', 'Call stack', 'Divide and conquer', 'Backtracking'],
    realWorld: ['File tree traversal', 'JSON parsing', 'Fractal generation', 'Game move generation'],
    studyTip: 'Always identify the base case first, then trust the recursive leap of faith.',
  },
  backtracking: {
    overview:
      'Backtracking explores all possibilities by building candidates incrementally and abandoning paths that can\'t succeed.',
    keyConcepts: ['Choice space', 'Pruning invalid branches', 'State restoration', 'Constraint satisfaction'],
    realWorld: ['Sudoku solvers', 'Puzzle games', 'Scheduling with constraints', 'Circuit layout'],
    studyTip: 'Template: choose → explore → unchoose. Prune early to avoid exploring dead ends.',
  },
  'tree-algorithms': {
    overview:
      'Tree algorithms traverse, measure, and transform hierarchical data — often via DFS, BFS, or recursion on subtrees.',
    keyConcepts: ['DFS vs BFS', 'Tree diameter', 'LCA (lowest common ancestor)', 'Path sums'],
    realWorld: ['Org chart queries', 'Filesystem operations', 'Compiler AST walks', 'Game decision trees'],
    studyTip: 'Pass information up from children (postorder) or down from parent (preorder) depending on the problem.',
  },
  greedy: {
    overview:
      'Greedy algorithms make the locally optimal choice at each step, hoping it leads to a global optimum.',
    keyConcepts: ['Greedy choice property', 'Optimal substructure', 'Exchange argument proofs', 'Interval scheduling'],
    realWorld: ['Huffman coding', 'Activity selection', 'Minimum coin change (certain denominations)', 'Cache eviction'],
    studyTip: 'Greedy works when local best choices compound — prove it or try counterexamples.',
  },
  'graph-algorithms': {
    overview:
      'Graph algorithms solve connectivity, shortest paths, cycles, and spanning trees on networked data.',
    keyConcepts: ['BFS/DFS', 'Dijkstra and Bellman-Ford', 'Topological sort', 'MST (Prim/Kruskal)'],
    realWorld: ['GPS navigation', 'Network routing', 'Build systems', 'Social network analysis'],
    studyTip: 'Unweighted shortest path = BFS. Weighted non-negative = Dijkstra. Negative edges = Bellman-Ford.',
  },
  'dynamic-programming': {
    overview:
      'Dynamic programming solves overlapping subproblems by caching results — turning exponential recursion into polynomial time.',
    keyConcepts: ['Memoization vs tabulation', 'State definition', 'Transition recurrence', 'Space optimization'],
    realWorld: ['Resource allocation', 'Bioinformatics alignment', 'Financial modeling', 'Game AI'],
    studyTip: 'Define dp[i] (or dp[i][j]) in plain English before writing any code.',
  },
  'bit-algorithms': {
    overview:
      'Bit manipulation exploits binary representation for compact storage and O(1) operations on individual flags.',
    keyConcepts: ['AND/OR/XOR masks', 'Bit shifting', 'Subset enumeration', 'Power-of-two tricks'],
    realWorld: ['Permission flags', 'Compression', 'Network protocols', 'Graphics pixel operations'],
    studyTip: 'Learn XOR tricks: a ^ a = 0, a ^ 0 = a. Single number problems love XOR.',
  },
  'two-pointers': {
    overview:
      'Two pointers use two indices moving through an array — from opposite ends or at different speeds — to solve problems in O(n).',
    keyConcepts: ['Opposite-end pointers', 'Same-direction pointers', 'Sorted array pair finding', 'In-place removal'],
    realWorld: ['Pair matching in sorted data', 'Palindrome validation', 'Memory-efficient merging', 'Interval problems'],
    studyTip: 'Sort first if needed, then place pointers. Watch for off-by-one when moving pointers.',
  },
  'sliding-window': {
    overview:
      'Sliding window maintains a contiguous subarray/substring window that expands and contracts to satisfy a condition.',
    keyConcepts: ['Fixed-size windows', 'Variable-size windows', 'Window validity invariant', 'Deque for max/min'],
    realWorld: ['Rate limiting', 'Stream processing', 'Substring search', 'Anomaly detection'],
    studyTip: 'Expand right until invalid, then shrink left until valid again — track the best window.',
  },
  'fast-slow-pointer': {
    overview:
      'Fast and slow pointers move at different speeds through a linked structure — detecting cycles and finding midpoints.',
    keyConcepts: ['Floyd\'s cycle detection', 'Middle node finding', 'Cycle entry point', 'Implicit linked structures'],
    realWorld: ['Infinite loop detection', 'Duplicate detection in sequences', 'Cryptographic analysis', 'Memory leak detection'],
    studyTip: 'Slow moves 1 step, fast moves 2. If they meet, there\'s a cycle.',
  },
  'monotonic-stack': {
    overview:
      'A monotonic stack maintains elements in sorted order (increasing or decreasing) to answer "next greater/smaller" queries in O(n).',
    keyConcepts: ['Next greater element', 'Stock span problems', 'Histogram area', 'Temperature waiting days'],
    realWorld: ['Stock price analysis', 'Temperature forecasting UI', 'Bar chart max area', 'Compiler parsing'],
    studyTip: 'Pop from stack while current element violates monotonic order, then push current.',
  },
  'string-algorithms': {
    overview:
      'String algorithms match patterns and find palindromes in linear time by reusing work a naive scan throws away: rolling hashes, prefix tables, and mirrored radii.',
    keyConcepts: ['Rolling hash', 'Prefix function (failure table)', 'Palindrome radii', 'Avoiding re-comparison'],
    realWorld: ['Text editors find/replace', 'Plagiarism detection', 'DNA sequence search', 'Intrusion detection signatures'],
    studyTip: 'Run the naive O(n·m) search by hand first, and spot the comparisons each algorithm skips.',
  },
  'advanced-searching': {
    overview:
      'Advanced binary search goes beyond finding a value: it searches a range of possible answers, or a partition point between two arrays.',
    keyConcepts: ['Monotonic predicates', 'Search on the answer space', 'Partitioning two sorted arrays', 'Off-by-one boundaries'],
    realWorld: ['Capacity planning', 'Load balancing thresholds', 'Database query optimizers', 'Statistics on merged data'],
    studyTip: 'Write the yes/no question you are binary searching on before writing the loop.',
  },
};

function defaultTopicTheory(name: string, description: string): TopicTheory {
  return {
    overview: `${name}: ${description} Study each lesson with the step-by-step visualizer to build intuition before attempting problems on your own.`,
    keyConcepts: ['Core operations and complexity', 'Step-by-step visualization', 'Common edge cases', 'Pattern variations'],
    realWorld: ['Technical interviews', 'Competitive programming', 'Production system design', 'Open-source libraries'],
    studyTip: 'Read the theory, watch the visualization, then try explaining the algorithm aloud without looking.',
  };
}

export function getTrackTheory(trackId: TrackId): TrackTheory {
  return trackTheory[trackId];
}

export function getLevelTheory(level: Level): LevelTheory {
  return levelTheory[level];
}

export function getTopicTheory(topicId: string, name: string, description: string): TopicTheory {
  return topicTheoryMap[topicId] ?? defaultTopicTheory(name, description);
}

export function countCurriculumLessons(): number {
  let total = 0;
  for (const track of tracks) {
    for (const level of levels) {
      for (const topic of track.topics[level] ?? []) {
        for (const diff of difficulties) {
          total += topic.lessons[diff]?.length ?? 0;
        }
      }
    }
  }
  return total;
}

export function countTrackTopics(trackId: TrackId): number {
  const track = tracks.find((t) => t.id === trackId);
  if (!track) return 0;
  return levels.reduce((sum, level) => sum + (track.topics[level]?.length ?? 0), 0);
}
