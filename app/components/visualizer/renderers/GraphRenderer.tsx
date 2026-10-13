'use client';

import { AlgorithmStep } from '@/src/core/engine/types';

interface Props {
  step: AlgorithmStep;
}

export default function GraphRenderer({ step }: Props) {
  const data = step.visualizationData ?? {};
  const nodes: { id: number | string; label?: string; x?: number; y?: number }[] = Array.isArray(data.nodes)
    ? data.nodes
    : Array.isArray(data.vertices)
    ? data.vertices.map((v: number | string, i: number) => ({ id: v, x: 60 + (i % 4) * 90, y: 60 + Math.floor(i / 4) * 80 }))
    : [0, 1, 2, 3, 4].map((v, i) => ({ id: v, x: 60 + (i % 3) * 100, y: 80 + Math.floor(i / 3) * 90 }));

  const edges: [number | string, number | string][] = Array.isArray(data.edges)
    ? data.edges
    : [];

  const visited = new Set(step.highlights ?? []);

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-auto p-4">
      <svg className="h-auto w-full max-w-[520px]" viewBox="0 0 400 280" role="img" aria-label={`Graph with ${nodes.length} nodes; ${visited.size} highlighted`}>
        {edges.map(([from, to], i) => {
          const a = nodes.find((n) => n.id === from);
          const b = nodes.find((n) => n.id === to);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={a.x ?? 0}
              y1={a.y ?? 0}
              x2={b.x ?? 0}
              y2={b.y ?? 0}
              stroke="var(--viz-idle)"
              strokeWidth={2}
            />
          );
        })}
        {nodes.map((node, i) => {
          const active = visited.has(i) || visited.has(Number(node.id));
          return (
            <g key={String(node.id)}>
              <circle
                cx={node.x ?? 0}
                cy={node.y ?? 0}
                r={28}
                fill={active ? 'color-mix(in srgb, var(--viz-active) 18%, var(--surface))' : 'var(--surface-2)'}
                stroke={active ? 'var(--viz-active)' : 'var(--viz-idle)'}
                strokeWidth={active ? 3 : 1.5}
                strokeDasharray={active ? undefined : '4 3'}
              />
              <text
                x={node.x ?? 0}
                y={(node.y ?? 0) + 5}
                textAnchor="middle"
                fill="var(--text)"
                fontSize={16}
                fontFamily="monospace"
              >
                {node.label ?? node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
