'use client';

import { AlgorithmStep } from '@/src/core/engine/types';

interface Props {
  step: AlgorithmStep;
}

export default function GenericRenderer({ step }: Props) {
  const data = step.visualizationData ?? {};

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6">
      <p className="mono-label">Visualization data</p>
      <pre className="max-h-[360px] w-full max-w-xl overflow-auto rounded-[var(--r-md)] bg-surface-2 p-4 text-xs leading-relaxed text-fg shadow-[inset_0_0_0_1px_var(--hairline)]">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
