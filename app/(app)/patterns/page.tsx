'use client';

import Link from 'next/link';
import Breadcrumbs from '@/app/components/Breadcrumbs';

import { Icon } from '@/src/components/Icon';
const patternCards = [
  {
    title: 'Two Pointers',
    description: 'Reverse Array, Palindrome, Two Sum Sorted',
    href: '/visual-lab/two-sum-sorted',
    icon: 'swap_horiz',
  },
  {
    title: 'Sliding Window',
    description: 'Fixed, Variable, and Longest Substring windows',
    href: '/visual-lab/sliding-window',
    icon: 'view_timeline',
  },
  {
    title: 'Fast Slow Pointer',
    description: 'Cycle detection and middle node patterns',
    href: '/visual-lab/cycle-detection',
    icon: 'sync_alt',
  },
  {
    title: 'Binary Search Patterns',
    description: 'Search boundaries and decision-based monotonic search',
    href: '/visual-lab/binary-search',
    icon: 'manage_search',
  },
  {
    title: 'Graph Patterns',
    description: 'Island counting, components, and traversals',
    href: '/visual-lab/graph-bfs',
    icon: 'hub',
  },
  {
    title: 'DP Patterns',
    description: 'State transition templates and optimization techniques',
    href: '/learn-path',
    icon: 'model_training',
  },
];

export default function PatternsPage() {
  return (
    <>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8 space-y-8">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/learn-path' }, { label: 'Patterns' }]} />

          <section className="space-y-3">
            <h1 className="font-display text-[44px] leading-[52px] font-extrabold text-fg">
              Problem Solving <span className="text-accent">Patterns</span>
            </h1>
            <p className="text-fg-2 max-w-3xl">
              Build reusable templates to solve unknown interview problems with less trial and error.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-8">
            {patternCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="surface rounded-xl p-5 space-y-4 hover:scale-[1.01] transition-transform"
              >
                <div className="w-11 h-11 rounded-lg bg-accent/15 text-accent grid place-items-center">
                  <Icon name={card.icon} />
                </div>
                <h2 className="font-display text-lg font-bold text-fg">{card.title}</h2>
                <p className="text-sm text-fg-2">{card.description}</p>
                <span className="inline-flex items-center gap-1 text-accent text-sm">
                  Explore
                  <Icon name="arrow_forward" className="text-sm" />
                </span>
              </Link>
            ))}
          </section>
        </div>
      </div>
    </>
  );
}
