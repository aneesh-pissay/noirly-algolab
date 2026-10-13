import { notFound } from 'next/navigation';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { dataStructures } from '@/app/data/dataStructures';

import { Icon } from '@/src/components/Icon';
export default async function DataStructureDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const structure = dataStructures.find((item) => item.id === id);

  if (!structure) {
    notFound();
  }

  return (
    <>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1200px] space-y-8 p-4 sm:p-8">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/learn-path' },
              { label: 'Data Structures', href: '/data-structures' },
              { label: structure.name },
            ]}
          />

          <section className="space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs border border-line bg-surface-2 text-fg-2">
              <Icon name="widgets" className="text-sm" />
              {structure.category}
            </span>
            <h1 className="font-display text-[44px] leading-[52px] font-extrabold text-fg">{structure.name}</h1>
            <p className="text-fg-2 max-w-3xl">{structure.description}</p>
          </section>

          <section className="surface rounded-xl p-6">
            <h2 className="font-display text-lg font-bold mb-4">Core Operations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(structure.operations).map(([operation, complexity]) => (
                <div key={operation} className="bg-bg rounded-lg border border-line p-4">
                  <div className="text-xs uppercase tracking-wider text-fg-2 mb-2">{operation}</div>
                  <div className="text-lg font-mono text-accent">{complexity}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface rounded-xl p-6">
            <h2 className="font-display text-lg font-bold mb-4">Visualization Topics</h2>
            <div className="flex flex-wrap gap-2">
              {structure.visualizations.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-full text-xs border border-accent/20 bg-accent/10 text-accent"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="text-fg-2 text-sm mt-4">
              Dedicated interactive lab for this structure is being expanded. Use the existing visual labs from the
              Playground section in the meantime.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
