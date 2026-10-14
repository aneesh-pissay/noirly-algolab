import { CodeLanguage } from '@/app/contexts/SettingsContext';
import { AlgorithmCategory } from '@/src/core/engine/types';

const L = (...lines: string[]) => lines;

const EXPLICIT_SNIPPETS: Record<string, string[]> = {
  'array-two-sum-sorted': L(
    'function twoSumSorted(nums, target) {',
    '  let left = 0, right = nums.length - 1;',
    '  while (left < right) {',
    '    const sum = nums[left] + nums[right];',
    '    if (sum === target) return [left, right];',
    '    if (sum < target) left++;',
    '    else right--;',
    '  }',
    '  return [];',
    '}'
  ),
  'array-three-sum': L(
    'function threeSum(nums, target = 0) {',
    '  nums.sort((a, b) => a - b); const result = [];',
    '  for (let i = 0; i < nums.length - 2; i++) {',
    '    if (i > 0 && nums[i] === nums[i - 1]) continue;',
    '    let left = i + 1, right = nums.length - 1;',
    '    while (left < right) {',
    '      const sum = nums[i] + nums[left] + nums[right];',
    '      if (sum === target) { result.push([nums[i], nums[left], nums[right]]);',
    '        skipDuplicates(); left++; right--; }',
    '      else if (sum < target) left++;',
    '      else right--;',
    '    }',
    '  }',
    '  return result;',
    '}'
  ),
  'array-remove-duplicates-sorted': L(
    'function removeDuplicates(nums) {',
    '  if (nums.length === 0) return 0;',
    '  let i = 1;',
    '  for (let j = 1; j < nums.length; j++) {',
    '    if (nums[j] !== nums[i - 1]) {',
    '      nums[i] = nums[j];',
    '      i++;',
    '    }',
    '  }',
    '  return i;',
    '}'
  ),
  'string-longest-unique-substring': L(
    'function lengthOfLongestSubstring(s) {',
    '  const lastSeen = new Map(); let left = 0, best = 0;',
    '  for (let right = 0; right < s.length; right++) {',
    '    const c = s[right];',
    '    if (lastSeen.get(c) >= left) left = lastSeen.get(c) + 1;',
    '    lastSeen.set(c, right);',
    '    best = Math.max(best, right - left + 1);',
    '  }',
    '  return best;',
    '}'
  ),
  'string-count-anagrams': L(
    'function countAnagrams(text, pattern) {',
    '  const need = counts(pattern), have = {}; let count = 0;',
    '  for (let right = 0; right < text.length; right++) {',
    '    have[text[right]] = (have[text[right]] ?? 0) + 1;',
    '    if (right >= pattern.length) have[text[right - pattern.length]]--;',
    '    if (right < pattern.length - 1) continue;',
    '    if (sameCounts(have, need)) count++;',
    '  }',
    '  return count;',
    '}'
  ),
  'sorting-bubble': L(
    'function bubbleSort(arr) {',
    '  for (let i = 0; i < arr.length - 1; i++) {',
    '    for (let j = 0; j < arr.length - i - 1; j++) {',
    '      if (arr[j] > arr[j + 1]) {',
    '        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];',
    '      }',
    '    }',
    '  }',
    '  return arr;',
    '}'
  ),
  'sorting-selection': L(
    'function selectionSort(arr) {',
    '  for (let i = 0; i < arr.length - 1; i++) {',
    '    let minIdx = i;',
    '    for (let j = i + 1; j < arr.length; j++) {',
    '      if (arr[j] < arr[minIdx]) minIdx = j;',
    '    }',
    '    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];',
    '  }',
    '  return arr;',
    '}'
  ),
  'sorting-insertion': L(
    'function insertionSort(arr) {',
    '  for (let i = 1; i < arr.length; i++) {',
    '    const key = arr[i];',
    '    let j = i - 1;',
    '    while (j >= 0 && arr[j] > key) {',
    '      arr[j + 1] = arr[j];',
    '      j--;',
    '    }',
    '    arr[j + 1] = key;',
    '  }',
    '  return arr;',
    '}'
  ),
  'sorting-merge': L(
    'function mergeSort(arr) {',
    '  if (arr.length <= 1) return arr;',
    '  const mid = Math.floor(arr.length / 2);',
    '  const left = mergeSort(arr.slice(0, mid));',
    '  const right = mergeSort(arr.slice(mid));',
    '  return merge(left, right);',
    '}',
    '',
    'function merge(a, b) {',
    '  const result = [];',
    '  while (a.length && b.length) {',
    '    result.push(a[0] <= b[0] ? a.shift() : b.shift());',
    '  }',
    '  return result.concat(a, b);',
    '}'
  ),
  'sorting-quick': L(
    'function quickSort(arr, lo = 0, hi = arr.length - 1) {',
    '  if (lo < hi) {',
    '    const p = partition(arr, lo, hi);',
    '    quickSort(arr, lo, p - 1);',
    '    quickSort(arr, p + 1, hi);',
    '  }',
    '  return arr;',
    '}',
    '',
    'function partition(arr, lo, hi) {',
    '  const pivot = arr[hi];',
    '  let i = lo - 1;',
    '  for (let j = lo; j < hi; j++) {',
    '    if (arr[j] <= pivot) {',
    '      i++;',
    '      [arr[i], arr[j]] = [arr[j], arr[i]];',
    '    }',
    '  }',
    '  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];',
    '  return i + 1;',
    '}'
  ),
  'sorting-heap': L(
    'function heapSort(arr) {',
    '  buildMaxHeap(arr);',
    '  for (let i = arr.length - 1; i > 0; i--) {',
    '    [arr[0], arr[i]] = [arr[i], arr[0]];',
    '    heapify(arr, 0, i);',
    '  }',
    '  return arr;',
    '}',
    '',
    'function heapify(arr, i, size) {',
    '  let largest = i;',
    '  const l = 2 * i + 1, r = 2 * i + 2;',
    '  if (l < size && arr[l] > arr[largest]) largest = l;',
    '  if (r < size && arr[r] > arr[largest]) largest = r;',
    '  if (largest !== i) {',
    '    [arr[i], arr[largest]] = [arr[largest], arr[i]];',
    '    heapify(arr, largest, size);',
    '  }',
    '}'
  ),
  'sorting-shell': L(
    'function shellSort(arr) {',
    '  for (let gap = Math.floor(arr.length / 2); gap > 0; gap = Math.floor(gap / 2)) {',
    '    for (let i = gap; i < arr.length; i++) {',
    '      const temp = arr[i];',
    '      let j = i;',
    '      while (j >= gap && arr[j - gap] > temp) {',
    '        arr[j] = arr[j - gap];',
    '        j -= gap;',
    '      }',
    '      arr[j] = temp;',
    '    }',
    '  }',
    '  return arr;',
    '}'
  ),
  'sorting-counting': L(
    'function countingSort(arr) {',
    '  const max = Math.max(...arr);',
    '  const count = new Array(max + 1).fill(0);',
    '  for (const n of arr) count[n]++;',
    '  let i = 0;',
    '  for (let v = 0; v <= max; v++) {',
    '    while (count[v]-- > 0) arr[i++] = v;',
    '  }',
    '  return arr;',
    '}'
  ),
  'sorting-radix': L(
    'function radixSort(arr) {',
    '  const max = Math.max(...arr);',
    '  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {',
    '    countingSortByDigit(arr, exp);',
    '  }',
    '  return arr;',
    '}'
  ),
  'sorting-bucket': L(
    'function bucketSort(arr) {',
    '  const buckets = Array.from({ length: arr.length }, () => []);',
    '  for (const n of arr) buckets[Math.floor(n * arr.length)].push(n);',
    '  return buckets.flat().sort((a, b) => a - b);',
    '}'
  ),
  'searching-linear': L(
    'function linearSearch(arr, target) {',
    '  for (let i = 0; i < arr.length; i++) {',
    '    if (arr[i] === target) return i;',
    '  }',
    '  return -1;',
    '}'
  ),
  'searching-binary': L(
    'function binarySearch(arr, target) {',
    '  let lo = 0, hi = arr.length - 1;',
    '  while (lo <= hi) {',
    '    const mid = Math.floor((lo + hi) / 2);',
    '    if (arr[mid] === target) return mid;',
    '    if (arr[mid] < target) lo = mid + 1;',
    '    else hi = mid - 1;',
    '  }',
    '  return -1;',
    '}'
  ),
  'searching-jump': L(
    'function jumpSearch(arr, target) {',
    '  const n = arr.length;',
    '  const step = Math.floor(Math.sqrt(n));',
    '  let prev = 0;',
    '  while (arr[Math.min(step, n) - 1] < target) {',
    '    prev = step;',
    '    step += Math.floor(Math.sqrt(n));',
    '    if (prev >= n) return -1;',
    '  }',
    '  for (let i = prev; i < Math.min(step, n); i++) {',
    '    if (arr[i] === target) return i;',
    '  }',
    '  return -1;',
    '}'
  ),
  'recursion-factorial': L(
    'function factorial(n) {',
    '  if (n <= 1) return 1;',
    '  return n * factorial(n - 1);',
    '}'
  ),
  'recursion-fibonacci': L(
    'function fibonacci(n) {',
    '  if (n <= 1) return n;',
    '  return fibonacci(n - 1) + fibonacci(n - 2);',
    '}'
  ),
  'array-traversal': L(
    'function traverse(arr) {',
    '  for (let i = 0; i < arr.length; i++) {',
    '    visit(arr[i], i);',
    '  }',
    '}'
  ),
  'array-insert-element': L(
    'function insert(arr, index, value) {',
    '  for (let i = arr.length - 1; i >= index; i--) {',
    '    arr[i + 1] = arr[i];',
    '  }',
    '  arr[index] = value;',
    '  return arr;',
    '}'
  ),
  'array-delete-element': L(
    'function removeAt(arr, index) {',
    '  for (let i = index; i < arr.length - 1; i++) {',
    '    arr[i] = arr[i + 1];',
    '  }',
    '  arr.pop();',
    '  return arr;',
    '}'
  ),
  'array-search-element': L(
    'function search(arr, target) {',
    '  for (let i = 0; i < arr.length; i++) {',
    '    if (arr[i] === target) return i;',
    '  }',
    '  return -1;',
    '}'
  ),
  'array-reverse': L(
    'function reverse(arr) {',
    '  let left = 0, right = arr.length - 1;',
    '  while (left < right) {',
    '    [arr[left], arr[right]] = [arr[right], arr[left]];',
    '    left++; right--;',
    '  }',
    '  return arr;',
    '}'
  ),
  'array-find-max-min': L(
    'function findMaxMin(arr) {',
    '  let max = arr[0], min = arr[0];',
    '  for (let i = 1; i < arr.length; i++) {',
    '    if (arr[i] > max) max = arr[i];',
    '    if (arr[i] < min) min = arr[i];',
    '  }',
    '  return { max, min };',
    '}'
  ),
  'array-two-sum': L(
    'function twoSum(nums, target) {',
    '  const seen = new Map();',
    '  for (let i = 0; i < nums.length; i++) {',
    '    const need = target - nums[i];',
    '    if (seen.has(need)) return [seen.get(need), i];',
    '    seen.set(nums[i], i);',
    '  }',
    '  return [];',
    '}'
  ),
  'stack-push-element': L(
    'const stack = [];',
    'function push(value) {',
    '  stack.push(value);',
    '  return stack;',
    '}'
  ),
  'stack-pop-element': L(
    'const stack = [];',
    'function pop() {',
    '  return stack.pop();',
    '}'
  ),
  'stack-peek-top-element': L(
    'const stack = [];',
    'function peek() {',
    '  return stack[stack.length - 1];',
    '}'
  ),
  'queue-enqueue-element': L(
    'const queue = [];',
    'function enqueue(value) {',
    '  queue.push(value);',
    '  return queue;',
    '}'
  ),
  'queue-dequeue-element': L(
    'const queue = [];',
    'function dequeue() {',
    '  return queue.shift();',
    '}'
  ),
  'queue-front-rear': L(
    'const queue = [];',
    'function front() { return queue[0]; }',
    'function rear() { return queue[queue.length - 1]; }'
  ),
  'graph-bfs': L(
    'function bfs(graph, start) {',
    '  const visited = new Set([start]);',
    '  const queue = [start];',
    '  while (queue.length) {',
    '    const node = queue.shift();',
    '    for (const neighbor of graph[node]) {',
    '      if (!visited.has(neighbor)) {',
    '        visited.add(neighbor);',
    '        queue.push(neighbor);',
    '      }',
    '    }',
    '  }',
    '  return [...visited];',
    '}'
  ),
  'graph-dfs': L(
    'function dfs(graph, node, visited = new Set()) {',
    '  visited.add(node);',
    '  for (const neighbor of graph[node]) {',
    '    if (!visited.has(neighbor)) dfs(graph, neighbor, visited);',
    '  }',
    '  return visited;',
    '}'
  ),
  'graph-dijkstra': L(
    'function dijkstra(graph, start) {',
    '  const dist = Object.fromEntries(Object.keys(graph).map((k) => [k, Infinity]));',
    '  dist[start] = 0;',
    '  const pq = [[0, start]];',
    '  while (pq.length) {',
    '    const [d, u] = pq.sort((a, b) => a[0] - b[0]).shift();',
    '    for (const [v, w] of graph[u]) {',
    '      if (d + w < dist[v]) {',
    '        dist[v] = d + w;',
    '        pq.push([dist[v], v]);',
    '      }',
    '    }',
    '  }',
    '  return dist;',
    '}'
  ),
};

function toFunctionName(algorithmId: string): string {
  const parts = algorithmId.split('-').filter((p) => !['array', 'string', 'stack', 'queue', 'hashmap', 'hashset', 'linked', 'list', 'binary', 'tree', 'graph', 'sorting', 'searching', 'recursion', 'heap', 'bst', 'trie', 'dll', 'dsu', 'avl', 'fenwick', 'segment'].includes(p));
  const name = parts.map((p, i) => (i === 0 ? p : p[0].toUpperCase() + p.slice(1))).join('');
  return name || 'solve';
}

function inferSnippet(algorithmId: string, category: AlgorithmCategory): string[] {
  if (EXPLICIT_SNIPPETS[algorithmId]) return EXPLICIT_SNIPPETS[algorithmId];

  const fn = toFunctionName(algorithmId);

  if (algorithmId.includes('traversal') || algorithmId.endsWith('-traverse')) {
    const param = algorithmId.startsWith('string') ? 's' : algorithmId.includes('linked-list') ? 'head' : 'arr';
    const len = param === 's' ? 's.length' : param === 'head' ? 'length' : 'arr.length';
    const access = param === 'head' ? 'node.val' : `${param}[i]`;
    return L(
      `function ${fn}(${param}) {`,
      `  for (let i = 0; i < ${len}; i++) {`,
      `    process(${access});`,
      `  }`,
      `}`
    );
  }

  if (algorithmId.includes('reverse')) {
    const param = algorithmId.startsWith('string') ? 's' : algorithmId.includes('linked-list') ? 'head' : 'arr';
    return L(
      `function ${fn}(${param}) {`,
      `  let left = 0, right = ${param === 's' ? 's.length - 1' : 'length - 1'};`,
      `  while (left < right) {`,
      `    swap(${param}, left, right);`,
      `    left++; right--;`,
      `  }`,
      `  return ${param};`,
      `}`
    );
  }

  if (algorithmId.includes('palindrome')) {
    return L(
      `function ${fn}(s) {`,
      `  let left = 0, right = s.length - 1;`,
      `  while (left < right) {`,
      `    if (s[left] !== s[right]) return false;`,
      `    left++; right--;`,
      `  }`,
      `  return true;`,
      `}`
    );
  }

  if (algorithmId.includes('insert')) {
    return L(
      `function ${fn}(data, index, value) {`,
      `  for (let i = data.length - 1; i >= index; i--) {`,
      `    data[i + 1] = data[i];`,
      `  }`,
      `  data[index] = value;`,
      `  return data;`,
      `}`
    );
  }

  if (algorithmId.includes('delete') || algorithmId.includes('remove')) {
    return L(
      `function ${fn}(data, index) {`,
      `  for (let i = index; i < data.length - 1; i++) {`,
      `    data[i] = data[i + 1];`,
      `  }`,
      `  data.pop();`,
      `  return data;`,
      `}`
    );
  }

  if (algorithmId.includes('search') || algorithmId.includes('find') || algorithmId.includes('lookup')) {
    return L(
      `function ${fn}(data, target) {`,
      `  for (let i = 0; i < data.length; i++) {`,
      `    if (data[i] === target) return i;`,
      `  }`,
      `  return -1;`,
      `}`
    );
  }

  if (algorithmId.startsWith('stack-')) {
    return L(
      'const stack = [];',
      `function ${fn}(value) {`,
      '  stack.push(value);',
      '  return stack;',
      '}'
    );
  }

  if (algorithmId.startsWith('queue-')) {
    return L(
      'const queue = [];',
      `function ${fn}(value) {`,
      '  queue.push(value);',
      '  return queue;',
      '}'
    );
  }

  if (algorithmId.startsWith('hashmap-')) {
    return L(
      'const map = new Map();',
      `function ${fn}(key, value) {`,
      '  map.set(key, value);',
      '  return map.get(key);',
      '}'
    );
  }

  if (algorithmId.startsWith('hashset-')) {
    return L(
      'const set = new Set();',
      `function ${fn}(value) {`,
      '  set.add(value);',
      '  return set.has(value);',
      '}'
    );
  }

  if (algorithmId.startsWith('binary-tree-') || algorithmId.startsWith('tree-')) {
    return L(
      `function ${fn}(root) {`,
      '  if (!root) return;',
      '  visit(root.val);',
      `  ${fn}(root.left);`,
      `  ${fn}(root.right);`,
      '}'
    );
  }

  if (algorithmId.startsWith('linked-list-') || algorithmId.startsWith('ll-')) {
    return L(
      `function ${fn}(head) {`,
      '  let curr = head;',
      '  while (curr) {',
      '    process(curr.val);',
      '    curr = curr.next;',
      '  }',
      '}'
    );
  }

  if (category === 'sorting') {
    return L(
      `function ${fn}(arr) {`,
      '  for (let i = 0; i < arr.length; i++) {',
      '    for (let j = 0; j < arr.length - i - 1; j++) {',
      '      if (arr[j] > arr[j + 1]) {',
      '        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];',
      '      }',
      '    }',
      '  }',
      '  return arr;',
      '}'
    );
  }

  if (category === 'searching') {
    return L(
      `function ${fn}(arr, target) {`,
      '  for (let i = 0; i < arr.length; i++) {',
      '    if (arr[i] === target) return i;',
      '  }',
      '  return -1;',
      '}'
    );
  }

  if (category === 'recursion') {
    return L(
      `function ${fn}(n) {`,
      '  if (n <= 1) return n;',
      `  return ${fn}(n - 1);`,
      '}'
    );
  }

  if (category === 'graph') {
    return L(
      `function ${fn}(graph, start) {`,
      '  const visited = new Set();',
      '  const queue = [start];',
      '  while (queue.length) {',
      '    const node = queue.shift();',
      '    if (!visited.has(node)) {',
      '      visited.add(node);',
      '    }',
      '  }',
      '  return [...visited];',
      '}'
    );
  }

  if (category === 'dp') {
    return L(
      `function ${fn}(n) {`,
      '  const dp = new Array(n + 1).fill(0);',
      '  for (let i = 1; i <= n; i++) {',
      '    dp[i] = Math.max(dp[i - 1], dp[i]);',
      '  }',
      '  return dp[n];',
      '}'
    );
  }

  return L(
    `function ${fn}(input) {`,
    '  const data = input.array ?? input;',
    '  for (let i = 0; i < data.length; i++) {',
    '    process(data[i], i);',
    '  }',
    '  return data;',
    '}'
  );
}

export function getCodeLines(
  algorithmId: string,
  category: AlgorithmCategory,
  language: CodeLanguage
): string[] {
  if (language !== 'javascript') {
    return [`// ${language} view coming soon`, '// Algorithm logic mirrors the JavaScript reference'];
  }
  return inferSnippet(algorithmId, category);
}
