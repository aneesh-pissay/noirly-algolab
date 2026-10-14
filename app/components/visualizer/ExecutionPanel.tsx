'use client';

import { Algorithm, AlgorithmStep } from '@/src/core/engine/types';

interface Props {
  algorithm: Algorithm;
  step: AlgorithmStep | null;
}

function KeyValueBlock({ title, data }: { title: string; data: Record<string, unknown> }) {
  const entries = Object.entries(data ?? {});
  if (!entries.length) return null;

  return (
    <div className="surface-flat p-3">
      <p className="mono-label mb-2">{title}</p>
      <dl className="space-y-1.5">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-start justify-between gap-2 text-xs">
            <dt className="font-mono text-accent">{key}</dt>
            <dd className="break-all text-right font-mono text-fg">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function ExecutionPanel({ algorithm, step }: Props) {
  if (!step) {
    return <div className="flex h-full items-center justify-center text-sm text-fg-3">No step loaded</div>;
  }

  const complexity = step.complexity ?? algorithm.complexity;

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto pr-1">
      <div className="surface-flat p-4">
        <p className="mono-label">Current action</p>
        <p className="mt-1 font-mono text-sm text-accent">{step.action}</p>
      </div>

      {/* Announced to screen readers as the visualization moves. */}
      <div className="surface-flat p-4">
        <p className="mono-label">Explanation</p>
        <p className="mt-2 text-sm leading-relaxed text-fg" aria-live="polite" aria-atomic="true">
          {step.description}
        </p>
      </div>

      <KeyValueBlock title="Variables" data={step.variables as Record<string, unknown>} />
      <KeyValueBlock title="Memory" data={step.memory as Record<string, unknown>} />

      <div className="surface-flat p-4">
        <p className="mono-label mb-2">Complexity</p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-fg-3">Time</dt>
            <dd className="font-mono text-accent">{complexity.time}</dd>
          </div>
          <div>
            <dt className="text-xs text-fg-3">Space</dt>
            <dd className="font-mono text-accent">{complexity.space}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
