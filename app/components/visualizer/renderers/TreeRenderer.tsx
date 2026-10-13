'use client';

import { AlgorithmStep } from '@/src/core/engine/types';

interface Props {
  step: AlgorithmStep;
}

function renderLevelOrder(values: (number | null | string)[]) {
  if (!values.length) return null;

  const levels: (number | null | string)[][] = [];
  let i = 0;
  let levelSize = 1;

  while (i < values.length) {
    levels.push(values.slice(i, i + levelSize));
    i += levelSize;
    levelSize *= 2;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {levels.map((level, li) => (
        <div key={li} className="flex items-center gap-2 sm:gap-4">
          {level.map((val, vi) => (
            <div
              key={`${li}-${vi}`}
              aria-hidden={val == null}
              className={`flex h-12 w-12 items-center justify-center rounded-full font-mono text-base font-semibold sm:h-16 sm:w-16 ${
                val == null ? 'text-transparent' : 'border border-line-strong bg-surface-2 text-fg'
              }`}
            >
              {val ?? '·'}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function TreeRenderer({ step }: Props) {
  const data = step.visualizationData ?? {};
  const tree = data.tree ?? data.levelOrder ?? data.nodes;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 overflow-auto p-4">
      <p className="mono-label">Tree</p>
      {Array.isArray(tree) ? (
        renderLevelOrder(tree)
      ) : (
        <pre className="max-w-full overflow-auto rounded-[var(--r-md)] bg-bg p-4 text-xs text-fg shadow-[inset_0_0_0_1px_var(--hairline)]">
          {JSON.stringify(tree ?? data, null, 2)}
        </pre>
      )}
    </div>
  );
}
