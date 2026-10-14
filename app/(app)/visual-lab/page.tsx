import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageContainer, PageHeader } from '@noirly-dev/ui';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { allVisualLabs, visualLabGroups } from '@/app/data/visualLabs';

export const metadata: Metadata = {
  title: 'Visual Lab · Noirly AlgoLab',
  description: 'Interactive, step-by-step visualizations of sorting, searching, two-pointer, sliding-window and graph algorithms.',
};

export default function VisualLabIndexPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Visual Lab' }]} />
      <PageHeader
        eyebrow={`${allVisualLabs.length} demos · free`}
        title="Visual Lab"
        lead="Standalone visualizations you can open and share without an account."
      />
      {visualLabGroups.map((group) => (
        <section key={group.id} aria-labelledby={`lab-${group.id}`} className="space-y-3">
          <div>
            <h2 id={`lab-${group.id}`} className="section-title">
              {group.title}
            </h2>
            <p className="text-sm text-fg-2">{group.description}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.labs.map((lab) => (
              <li key={lab.slug}>
                <Link
                  href={`/visual-lab/${lab.slug}`}
                  className="surface surface-interactive spotlight grain focusable flex items-center justify-between gap-3 rounded-[var(--r-lg)] px-4 py-3.5"
                >
                  <span className="text-sm font-medium text-fg">{lab.title}</span>
                  <ArrowRight size={14} className="shrink-0 text-fg-3" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </PageContainer>
  );
}
