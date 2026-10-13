'use client';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../contexts/AuthContext';

export default function ProgressPage() {
  const { user } = useAuth();

  const cards = [
    { label: 'Lessons Completed', value: '—', icon: 'menu_book' },
    { label: 'Topics In Progress', value: '—', icon: 'timeline' },
    { label: 'Current Focus', value: 'Learning Path', icon: 'route' },
    { label: 'Account', value: user?.name ?? '—', icon: 'person' },
  ];

  return (
    <>
      <Sidebar />
      <Header />

      <main className="app-main h-screen overflow-y-auto bg-background">
        <div className="max-w-[1200px] mx-auto p-8 space-y-8">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/learn-path' }, { label: 'Progress' }]} />

          <section className="space-y-3">
            <h1 className="font-display text-[44px] leading-[52px] font-extrabold text-white">
              Learning <span className="text-primary">Progress</span>
            </h1>
            <p className="text-on-surface-variant max-w-3xl">
              Track lesson completion and topic progress across your DSA journey.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div key={card.label} className="glass-card rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-primary/15 text-primary grid place-items-center mb-3">
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider">{card.label}</p>
                <p className="text-2xl font-display font-bold text-white mt-1">{card.value}</p>
              </div>
            ))}
          </section>

          <section className="glass-card rounded-xl p-6">
            <h2 className="font-display text-headline-sm font-bold text-white mb-3">Progress Timeline</h2>
            <div className="space-y-3">
              <div className="bg-surface-dim rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white">Completed Beginner Foundations</p>
                <p className="text-xs text-on-surface-variant mt-1">Arrays, Stack, Bubble Sort, Binary Search</p>
              </div>
              <div className="bg-surface-dim rounded-lg p-4 border border-white/10">
                <p className="text-sm text-white">Now Working On Intermediate Modules</p>
                <p className="text-xs text-on-surface-variant mt-1">Linked List, Merge Sort, Sliding Window</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
