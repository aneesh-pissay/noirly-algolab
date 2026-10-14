'use client';

import { dataStructures } from '@/app/data/dataStructures';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import Link from 'next/link';

import { Icon } from '@/src/components/Icon';
const categories = ['All', 'Linear', 'Hierarchical', 'Non-Linear'];

export default function DataStructuresPage() {
  return (
    <>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-8 space-y-8">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/' }, { label: 'Data Structures' }]} />

          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="font-display text-[48px] leading-[56px] font-extrabold text-fg">
              Data <span className="text-accent">Structures</span>
            </h1>
            <p className="text-fg-2 font-sans max-w-2xl">
              Master fundamental data structures through interactive visualizations. Understand how data is organized,
              stored, and accessed with visual demonstrations of each operation.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="surface p-5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name="database" className="text-accent text-2xl" />
                </div>
                <div>
                  <p className="text-fg-2 text-sm">Total Structures</p>
                  <h3 className="text-2xl font-bold font-display text-fg">{dataStructures.length}</h3>
                </div>
              </div>
            </div>
            <div className="surface p-5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-positive/10 rounded-lg flex items-center justify-center">
                  <Icon name="check_circle" className="text-positive text-2xl" />
                </div>
                <div>
                  <p className="text-fg-2 text-sm">Mastered</p>
                  <h3 className="text-2xl font-bold font-display text-fg">4</h3>
                </div>
              </div>
            </div>
            <div className="surface p-5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-negative/10 rounded-lg flex items-center justify-center">
                  <Icon name="pending" className="text-negative text-2xl" />
                </div>
                <div>
                  <p className="text-fg-2 text-sm">In Progress</p>
                  <h3 className="text-2xl font-bold font-display text-fg">3</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg font-display text-sm transition-all whitespace-nowrap ${
                  category === 'All'
                    ? 'bg-accent text-accent-ink'
                    : 'bg-surface-2 text-fg-2 hover:bg-fg/5 hover:text-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Data Structures Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {dataStructures.map((ds) => (
              <Link
                key={ds.id}
                href={`/data-structures/${ds.id}`}
                className="surface rounded-xl overflow-hidden hover:scale-[1.02] transition-all cursor-pointer group"
              >
                {/* Icon Header */}
                <div className="bg-surface p-6 flex items-center justify-center border-b border-line">
                  <div className="relative">
                    <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <Icon name={ds.icon} className="text-accent text-5xl" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-bold text-fg group-hover:text-accent transition-colors mb-1">
                        {ds.name}
                      </h3>
                      <span className="text-fg-2 text-sm">{ds.category}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                        ds.difficulty === 'Easy'
                          ? 'bg-positive/10 text-positive'
                          : ds.difficulty === 'Medium'
                          ? 'bg-negative/10 text-negative'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {ds.difficulty}
                    </span>
                  </div>

                  <p className="text-fg-2 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {ds.description}
                  </p>

                  {/* Operations */}
                  <div className="space-y-2 pt-4 border-t border-line">
                    <h4 className="text-[10px] font-mono text-fg-2 uppercase tracking-wider mb-3">
                      Time Complexity
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(ds.operations).map(([op, complexity]) => (
                        <div key={op} className="flex justify-between text-xs font-mono">
                          <span className="text-fg-2 capitalize">{op}</span>
                          <span className="text-accent">{complexity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center text-accent text-sm group-hover:gap-2 transition-all">
                    <span className="font-medium">Explore Structure</span>
                    <Icon name="arrow_forward" className="text-sm" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
