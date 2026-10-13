'use client';

import { motion } from 'framer-motion';
import { AlgorithmStep } from '@/src/core/engine/types';
import { getActionVariants } from './actionVariants';
import { vizCellStyle, vizStateFor } from './vizState';

interface Props {
  step: AlgorithmStep;
}

export default function ArrayRenderer({ step }: Props) {
  const data = step.visualizationData ?? {};
  const array: (number | string)[] = Array.isArray(data.array)
    ? data.array
    : Array.isArray(data.nums)
    ? data.nums
    : Array.isArray(data.values)
    ? data.values
    : [];
  const highlights = step.highlights ?? [];
  const variables = step.variables ?? {};
  const variants = getActionVariants(step.action);
  const state = vizStateFor(step.action);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <ul aria-label="Array" className="flex flex-wrap items-end justify-center gap-2 px-2 sm:gap-4 sm:px-6">
        {array.map((value, index) => {
          const isHighlighted = highlights.includes(index);
          const pointers = [
            variables.i === index ? 'i' : null,
            variables.j === index ? 'j' : null,
            variables.left === index ? 'L' : null,
            variables.right === index ? 'R' : null,
            variables.key === value && variables.i === index ? 'key' : null,
          ].filter(Boolean) as string[];

          return (
            <motion.li
              key={`${index}-${value}`}
              layout
              variants={variants}
              initial="initial"
              animate={isHighlighted ? 'animate' : 'initial'}
              className="flex flex-col items-center gap-2"
              aria-label={`index ${index}, value ${value}${isHighlighted ? `, ${state.label}` : ''}${pointers.length ? `, pointer ${pointers.join(' ')}` : ''}`}
            >
              <div className="flex h-5 gap-1.5 font-mono text-xs font-semibold text-accent" aria-hidden>
                {pointers.map((p) => (
                  <span key={p}>{p}</span>
                ))}
              </div>
              <div
                className={`relative flex h-16 w-12 items-center justify-center rounded-[var(--r-md)] font-display text-xl font-bold transition-colors sm:h-24 sm:w-20 sm:text-3xl ${
                  isHighlighted ? '' : 'border border-line bg-surface-2 text-fg'
                }`}
                style={isHighlighted ? vizCellStyle(state) : undefined}
              >
                {value}
                {isHighlighted ? (
                  <span aria-hidden className="absolute right-1 top-0.5 font-mono text-[10px] font-semibold" style={{ color: state.color }}>
                    {state.symbol}
                  </span>
                ) : null}
              </div>
              <span className="font-mono text-xs text-fg-2" aria-hidden>
                {index}
              </span>
            </motion.li>
          );
        })}
      </ul>

      {highlights.length > 0 && array.length > 0 ? (
        <p className="meta" aria-hidden>
          <span style={{ color: state.color }}>{state.symbol}</span> {state.label}
        </p>
      ) : null}

      {array.length === 0 && <p className="text-base text-fg-2">No array data in this step.</p>}
    </div>
  );
}
