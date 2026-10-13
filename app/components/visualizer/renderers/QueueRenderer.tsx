'use client';

import { motion } from 'framer-motion';
import { AlgorithmStep } from '@/src/core/engine/types';
import { getActionVariants } from './actionVariants';
import { vizCellStyle, vizStateFor } from './vizState';

interface Props {
  step: AlgorithmStep;
}

export default function QueueRenderer({ step }: Props) {
  const data = step.visualizationData ?? {};
  const queue: (number | string)[] = Array.isArray(data.queue) ? data.queue : [];
  const variants = getActionVariants(step.action);
  const state = vizStateFor(step.action);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-2 sm:px-6">
      <div className="mono-label flex w-full max-w-2xl items-center justify-between" aria-hidden>
        <span>Front</span>
        <span>Rear</span>
      </div>
      <ul
        aria-label={`Queue, front to rear: ${queue.join(', ') || 'empty'}`}
        className="flex w-full max-w-2xl items-center gap-2 overflow-x-auto rounded-[var(--r-lg)] bg-bg p-4 shadow-[inset_0_0_0_1px_var(--hairline)]"
      >
        {queue.length === 0 ? (
          <li className="w-full text-center text-sm text-fg-3">Empty queue</li>
        ) : (
          queue.map((value, index) => {
            const isFront = index === 0;
            const isRear = index === queue.length - 1;
            const marked = isFront || isRear;
            return (
              <motion.li
                key={`${index}-${value}`}
                layout
                variants={variants}
                initial="initial"
                animate={marked ? 'animate' : 'initial'}
                className={`relative flex h-16 min-w-[4.5rem] shrink-0 items-center justify-center rounded-[var(--r-md)] font-mono text-xl font-semibold sm:h-20 sm:min-w-[5.5rem] ${
                  marked ? '' : 'border border-line bg-surface-2 text-fg'
                }`}
                style={marked ? vizCellStyle(state) : undefined}
              >
                {value}
                {marked ? (
                  <span className="absolute left-1.5 top-1 font-mono text-[10px] text-fg-2">{isFront ? 'front' : 'rear'}</span>
                ) : null}
              </motion.li>
            );
          })
        )}
      </ul>
      <div className="flex gap-6 text-sm text-fg-2">
        {data.front != null && (
          <span>
            Front: <span className="font-mono text-accent">{String(data.front)}</span>
          </span>
        )}
        {data.rear != null && (
          <span>
            Rear: <span className="font-mono text-accent">{String(data.rear)}</span>
          </span>
        )}
      </div>
    </div>
  );
}
