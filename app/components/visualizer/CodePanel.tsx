'use client';

import { useEffect, useRef } from 'react';
import { Algorithm, AlgorithmStep } from '@/src/core/engine/types';
import { useSettings } from '@/app/contexts/SettingsContext';
import { getCodeLines } from './codeSnippets';
import { resolveActiveCodeLine } from './resolveCodeLine';

interface Props {
  algorithmId: string;
  algorithm: Algorithm;
  step: AlgorithmStep;
}

export default function CodePanel({ algorithmId, algorithm, step }: Props) {
  const { codeLanguage } = useSettings();
  const lines = getCodeLines(algorithmId, algorithm.category, codeLanguage);
  const activeLine = resolveActiveCodeLine(algorithmId, algorithm.category, step, lines.length);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll the code box only. scrollIntoView would also scroll the page
    // (and the shell's content pane), pulling the visualizer out of view.
    const container = containerRef.current;
    const line = activeLineRef.current;
    if (!container || !line) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const top = line.offsetTop - container.clientHeight / 2 + line.clientHeight / 2;
    container.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
  }, [activeLine, step.id]);

  return (
    <div className="surface rounded-[var(--r-lg)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="mono-label">Code</p>
        <span className="pill">{codeLanguage}</span>
      </div>
      <div
        ref={containerRef}
        tabIndex={0}
        aria-label={`${algorithm.name} code, line ${activeLine} highlighted`}
        className="focusable relative max-h-[280px] overflow-auto rounded-[var(--r-md)] bg-bg shadow-[inset_0_0_0_1px_var(--hairline)]"
      >
        <pre className="p-3 font-mono text-sm leading-7 text-fg">
          {lines.map((line, index) => {
            const lineNo = index + 1;
            const active = lineNo === activeLine;
            return (
              <div
                key={lineNo}
                ref={active ? activeLineRef : undefined}
                className={`flex gap-3 rounded px-2 -mx-2 transition-colors ${
                  active ? 'border-l-[3px] border-accent bg-accent-soft' : 'border-l-[3px] border-transparent'
                }`}
              >
                <span
                  className={`w-6 shrink-0 select-none text-right text-xs ${
                    active ? 'text-accent font-semibold' : 'text-fg-3'
                  }`}
                >
                  {active ? '▶' : lineNo}
                </span>
                <code className={`whitespace-pre ${active ? 'font-medium text-fg' : ''}`}>
                  {line || ' '}
                </code>
              </div>
            );
          })}
        </pre>
      </div>
      <p className="mt-2 text-xs text-fg-3">
        Executing line <span className="font-mono text-accent">{activeLine}</span> of{' '}
        <span className="font-mono">{lines.length}</span>
      </p>
    </div>
  );
}
