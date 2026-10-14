import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { algorithms } from '@/app/data/algorithms';

import { Icon } from '@/src/components/Icon';
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

export default async function AlgorithmDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const algorithm = algorithms.find((item) => item.id === id);

  if (!algorithm) {
    notFound();
  }

  const visualLabHref = availableVisualLabs.has(algorithm.id) ? `/visual-lab/${algorithm.id}` : null;

  return (
    <>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] space-y-8 p-4 sm:p-8">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Algorithms', href: '/algorithms' },
              { label: algorithm.name },
            ]}
          />

          <section className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-line bg-surface-2 text-fg-2">
              <Icon name="deployed_code" className="text-sm" />
              {algorithm.pattern}
            </span>
            <h1 className="font-display text-[44px] leading-[52px] font-extrabold text-fg">{algorithm.name}</h1>
            <p className="text-fg-2 max-w-3xl">{algorithm.description}</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="surface rounded-xl p-6">
              <h2 className="font-display text-lg font-bold mb-4">Complexity</h2>
              <div className="space-y-3">
                <div className="bg-bg rounded-lg p-3 border border-line">
                  <p className="text-xs uppercase tracking-wide text-fg-2">Time</p>
                  <p className="text-lg font-mono text-accent mt-1">{algorithm.timeComplexity}</p>
                </div>
                <div className="bg-bg rounded-lg p-3 border border-line">
                  <p className="text-xs uppercase tracking-wide text-fg-2">Space</p>
                  <p className="text-lg font-mono text-accent mt-1">{algorithm.spaceComplexity}</p>
                </div>
              </div>
            </div>

            <div className="surface rounded-xl p-6">
              <h2 className="font-display text-lg font-bold mb-4">Actions</h2>
              <div className="flex flex-wrap gap-2">
                {visualLabHref ? (
                  <Link href={visualLabHref} className="px-4 py-2 rounded-lg bg-accent text-accent-ink text-sm hover:brightness-110 transition">
                    Open Visual Lab
                  </Link>
                ) : (
                  <span className="px-4 py-2 rounded-lg bg-surface-2 text-fg-2 text-sm border border-line">
                    Visual Lab Coming Soon
                  </span>
                )}
                <Link href="/algorithms" className="px-4 py-2 rounded-lg bg-surface-2 text-fg text-sm hover:bg-fg/5 transition">
                  Back To Algorithms
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
