'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { algorithms } from '@/app/data/algorithms';

const availableVisualLabs = new Set([
  'a-star',
  'average-subarray',
  'avl-search',
  'bellman-ford',
  'binary-search',
  'bst-search',
  'bubble-sort',
  'bucket-sort',
  'character-replacement',
  'cocktail-sort',
  'comb-sort',
  'container-water',
  'count-anagrams',
  'counting-sort',
  'cycle-detection',
  'cycle-sort',
  'dijkstra',
  'exponential-search',
  'first-negative-number',
  'fixed-size-window',
  'fruit-basket',
  'graph-bfs',
  'graph-dfs',
  'heap-sort',
  'insertion-sort',
  'interpolation-search',
  'intro-sort',
  'jump-search',
  'k-distinct-chars',
  'longest-unique-substring',
  'max-sum-size-k',
  'merge-sort',
  'middle-linked-list',
  'min-size-subarray',
  'min-window-substring',
  'move-zeroes',
  'palindrome-check',
  'pancake-sort',
  'partition-algorithm',
  'permutation-string',
  'quick-sort',
  'radix-sort',
  'red-black-search',
  'remove-duplicates',
  'reverse-array',
  'selection-sort',
  'shell-sort',
  'sliding-window',
  'sliding-window-max',
  'ternary-search',
  'three-sum',
  'tim-sort',
  'trapping-rain-water',
  'two-sum-sorted',
  'variable-window',
]);

const patterns = ['All', 'Sorting', 'Searching', 'Two Pointers', 'Sliding Window', 'Recursion', 'Backtracking', 'Dynamic Programming', 'Graph'] as const;

export default function AlgorithmsPage() {
  const [activePattern, setActivePattern] = useState<(typeof patterns)[number]>('All');
  const [query, setQuery] = useState('');

  const filteredAlgorithms = useMemo(() => {
    return algorithms.filter((algorithm) => {
      const patternMatch = activePattern === 'All' || algorithm.pattern === activePattern;
      const text = `${algorithm.name} ${algorithm.pattern} ${algorithm.description}`.toLowerCase();
      const queryMatch = text.includes(query.toLowerCase());
      return patternMatch && queryMatch;
    });
  }, [activePattern, query]);

  return (
    <>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-8 space-y-8">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/learn-path' }, { label: 'Algorithms' }]} />

          <section className="space-y-4">
            <h1 className="font-display text-[48px] leading-[56px] font-extrabold text-fg">
              Algorithm <span className="text-accent">Library</span>
            </h1>
            <p className="text-fg-2 font-sans max-w-3xl">
              Browse core algorithm categories, jump into visual labs, and open challenge-ready references.
            </p>
          </section>

          <div className="surface rounded-xl p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {patterns.map((pattern) => (
                <button
                  key={pattern}
                  onClick={() => setActivePattern(pattern)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    activePattern === pattern
                      ? 'bg-accent/15 border-accent/40 text-accent'
                      : 'bg-surface-2 border-line text-fg-2 hover:text-accent'
                  }`}
                >
                  {pattern}
                </button>
              ))}
            </div>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search algorithms..."
              className="bg-surface-2 border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/40"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {filteredAlgorithms.map((algorithm) => {
              const hasLab = availableVisualLabs.has(algorithm.id);
              const primaryHref = hasLab ? `/visual-lab/${algorithm.id}` : `/algorithms/${algorithm.id}`;

              return (
                <article key={algorithm.id} className="surface rounded-xl p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-fg">{algorithm.name}</h3>
                      <p className="text-xs text-fg-2 mt-1">{algorithm.pattern}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-md border border-line bg-surface-2 text-fg-2">
                      {algorithm.difficulty}
                    </span>
                  </div>

                  <p className="text-sm text-fg-2 leading-relaxed min-h-[60px]">{algorithm.description}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-bg rounded-lg p-2 border border-line">
                      <div className="text-fg-2">Time</div>
                      <div className="text-accent font-mono">{algorithm.timeComplexity}</div>
                    </div>
                    <div className="bg-bg rounded-lg p-2 border border-line">
                      <div className="text-fg-2">Space</div>
                      <div className="text-accent font-mono">{algorithm.spaceComplexity}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={primaryHref} className="px-3 py-2 rounded-lg text-sm bg-accent text-accent-ink hover:brightness-110 transition">
                      {hasLab ? 'Visualize' : 'Open Details'}
                    </Link>
                    <Link href={`/algorithms/${algorithm.id}`} className="px-3 py-2 rounded-lg text-sm bg-surface-2 text-fg hover:bg-fg/5 transition">
                      Learn
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}