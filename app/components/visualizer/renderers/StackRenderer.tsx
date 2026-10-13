'use client';

import { motion } from 'framer-motion';
import { AlgorithmStep } from '@/src/core/engine/types';
import { getActionVariants } from './actionVariants';
import { vizCellStyle, vizStateFor } from './vizState';

interface Props {
  step: AlgorithmStep;
}

export default function StackRenderer({ step }: Props) {
  const data = step.visualizationData ?? {};
  const stack: (number | string)[] = Array.isArray(data.stack) ? [...data.stack] : [];
  const display = [...stack].reverse();
  const variants = getActionVariants(step.action);
  const state = vizStateFor(step.action);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <p className="mono-label">Stack (LIFO)</p>
      <ul
        aria-label={`Stack, top to bottom: ${display.join(', ') || 'empty'}`}
        className="flex min-h-[280px] w-44 flex-col items-stretch gap-3 rounded-[var(--r-lg)] bg-bg p-4 shadow-[inset_0_0_0_1px_var(--hairline)] sm:w-52"
      >
        {display.length === 0 ? (
          <li className="flex flex-1 items-center justify-center text-sm text-fg-3">Empty</li>
        ) : (
          display.map((value, index) => {
            const isTop = index === 0;
            return (
              <motion.li
                key={`${index}-${value}`}
                layout
                variants={variants}
                initial="initial"
                animate={isTop ? 'animate' : 'initial'}
                className={`relative flex h-14 items-center justify-center rounded-[var(--r-md)] font-mono text-xl font-semibold ${
                  isTop ? '' : 'border border-line bg-surface-2 text-fg'
                }`}
                style={isTop ? vizCellStyle(state) : undefined}
              >
                {value}
                {isTop ? <span className="absolute left-2 top-1 font-mono text-[10px] text-fg-2">top</span> : null}
              </motion.li>
            );
          })
        )}
      </ul>
      {data.top != null && (
        <p className="text-sm text-fg">
          Top: <span className="font-mono text-accent">{String(data.top)}</span>
        </p>
      )}
    </div>
  );
}
