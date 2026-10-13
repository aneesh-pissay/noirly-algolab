'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { bellmanFord } from '@/src/core/algorithms/graphs/bellmanFord';
import { AlgorithmStep, VisualizerState, Graph } from '@/src/core/engine/types';

import { Icon } from '@/src/components/Icon';
// Sample weighted graph for demonstration
const sampleGraph: Graph = {
  vertices: 5,
  edges: new Map([
    [0, [1, 2]],
    [1, [2, 3]],
    [2, [3]],
    [3, [4]],
    [4, [2]],
  ]),
  weighted: true,
  weights: new Map([
    ['0-1', 6],
    ['0-2', 7],
    ['1-2', 8],
    ['1-3', 5],
    ['2-3', -3],
    ['3-4', 9],
    ['4-2', -2],
  ]),
};

export default function BellmanFordPage() {
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Register and execute algorithm
    visualizerEngine.registerAlgorithm('bellman-ford', bellmanFord);
    visualizerEngine.execute('bellman-ford', {
      graph: sampleGraph,
      startVertex: 0
    });

    // Subscribe to state changes
    const unsubscribe = visualizerEngine.subscribe((newState) => {
      setState(newState);
      setCurrentStep(visualizerEngine.getCurrentStep());
    });

    // Get initial state
    setState(visualizerEngine.getState());
    setCurrentStep(visualizerEngine.getCurrentStep());
    setIsInitialized(true);

    return () => unsubscribe();
  }, []);

  const handlePlay = () => visualizerEngine.play();
  const handlePause = () => visualizerEngine.pause();
  const handleNext = () => visualizerEngine.nextStep();
  const handlePrevious = () => visualizerEngine.previousStep();
  const handleReset = () => visualizerEngine.reset();

  if (!isInitialized || !state || !currentStep) {
    return (
      <>
        <div className="min-h-0 flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="progress_activity" className="text-accent text-6xl animate-spin" />
            <p className="text-fg-2 mt-4">Loading visualization...</p>
          </div>
        </div>
      </>
    );
  }

  const graph = currentStep.visualizationData?.graph || sampleGraph;
  const currentVertex = currentStep.visualizationData?.currentVertex;
  const distances = currentStep.visualizationData?.distances || {};
  const exploringEdge = currentStep.visualizationData?.exploringEdge;
  const hasNegativeCycle = currentStep.visualizationData?.hasNegativeCycle;
  const highlights = currentStep.highlights || [];
  const variables = currentStep.variables || {};
  const isPlaying = state.isPlaying;
  const progress = ((state.currentStep + 1) / state.totalSteps) * 100;

  // Graph layout positions
  const positions: { [key: number]: { x: number; y: number } } = {
    0: { x: 100, y: 200 },
    1: { x: 250, y: 100 },
    2: { x: 250, y: 300 },
    3: { x: 400, y: 200 },
    4: { x: 550, y: 250 },
  };

  return (
    <>

      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        <div className="p-4">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Learning Path', href: '/learn-path' },
              { label: 'Bellman-Ford' },
            ]}
          />
        </div>

        {/* Three Column Split Layout */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 gap-4 pt-0">
          {/* Left Panel (Visualization) */}
          <section className="flex-[1.5] flex flex-col gap-4 min-w-0">
            <div className="glass-panel rounded-xl p-6 flex flex-col flex-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-lg flex items-center gap-2">
                  <Icon name="timeline" className="text-negative" />
                  Bellman-Ford Algorithm
                </h2>
                <div className="flex items-center gap-2 bg-bg/50 px-4 py-2 rounded-lg border border-line">
                  <Icon name="change_history" className="text-sm text-fg-2" />
                  <span className="font-mono text-fg">Handles Negative Weights</span>
                </div>
              </div>

              {/* Graph Visualization */}
              <div className="flex-1 flex items-center justify-center relative overflow-auto">
                <svg width="100%" height="100%" viewBox="0 0 650 400" preserveAspectRatio="xMidYMid meet">
                  {/* Draw edges with weights */}
                  {[...graph.edges.entries()].map(([from, toList]) =>
                    toList.map((to: number) => {
                      const isExploring = exploringEdge && exploringEdge[0] === from && exploringEdge[1] === to;
                      const edgeKey = `${from}-${to}`;
                      const weight = graph.weights?.get(edgeKey) || 0;
                      const dx = positions[to].x - positions[from].x;
                      const dy = positions[to].y - positions[from].y;
                      const length = Math.sqrt(dx * dx + dy * dy);
                      const offset = 30 / length;
                      const x2 = positions[to].x - dx * offset;
                      const y2 = positions[to].y - dy * offset;
                      const midX = (positions[from].x + x2) / 2;
                      const midY = (positions[from].y + y2) / 2;
                      const isNegative = weight < 0;

                      return (
                        <g key={`${from}-${to}`}>
                          <defs>
                            <marker
                              id={`arrow-${from}-${to}`}
                              markerWidth="10"
                              markerHeight="10"
                              refX="9"
                              refY="3"
                              orient="auto"
                              markerUnits="strokeWidth"
                            >
                              <path d="M0,0 L0,6 L9,3 z" fill={isExploring ? 'var(--negative)' : 'var(--hairline-strong)'} />
                            </marker>
                          </defs>
                          <line
                            x1={positions[from].x}
                            y1={positions[from].y}
                            x2={x2}
                            y2={y2}
                            stroke={isExploring ? 'var(--negative)' : isNegative ? 'var(--destructive)' : 'var(--hairline-strong)'}
                            strokeWidth={isExploring ? '3' : '2'}
                            opacity={isExploring ? 1 : 0.5}
                            markerEnd={`url(#arrow-${from}-${to})`}
                            className="transition-all duration-300"
                          />
                          <circle cx={midX} cy={midY} r="14" fill="var(--surface-2)" stroke={isNegative ? 'var(--destructive)' : 'var(--hairline-strong)'} strokeWidth="1" />
                          <text
                            x={midX}
                            y={midY + 4}
                            textAnchor="middle"
                            fill={isNegative ? 'var(--destructive)' : 'var(--accent)'}
                            fontSize="11"
                            fontWeight="bold"
                          >
                            {weight}
                          </text>
                        </g>
                      );
                    })
                  )}

                  {/* Draw vertices */}
                  {Array.from({ length: graph.vertices }).map((_, v) => {
                    const isCurrent = currentVertex === v;
                    const isHighlighted = highlights.includes(v);
                    const dist = distances[v] !== undefined ? (distances[v] === Infinity ? '∞' : distances[v]) : '∞';

                    return (
                      <g key={v}>
                        <circle
                          cx={positions[v].x}
                          cy={positions[v].y}
                          r="28"
                          fill={isCurrent ? 'var(--negative)' : 'var(--surface-2)'}
                          stroke={isHighlighted ? 'var(--negative)' : 'var(--hairline-strong)'}
                          strokeWidth="3"
                          className="transition-all duration-300"
                          style={{
                            filter: isHighlighted ? 'drop-shadow(0 0 12px color-mix(in srgb, var(--negative) 60%, transparent))' : 'none'
                          }}
                        />
                        <text
                          x={positions[v].x}
                          y={positions[v].y + 5}
                          textAnchor="middle"
                          fill="white"
                          fontSize="16"
                          fontWeight="bold"
                        >
                          {v}
                        </text>
                        <text
                          x={positions[v].x}
                          y={positions[v].y - 40}
                          textAnchor="middle"
                          fill="var(--negative)"
                          fontSize="13"
                          fontWeight="bold"
                        >
                          {dist}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend & Warning */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-6 justify-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-negative"></div>
                    <span className="text-xs text-fg-2">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-destructive"></div>
                    <span className="text-xs text-fg-2">Negative Weight</span>
                  </div>
                </div>
                {hasNegativeCycle && (
                  <div className="flex items-center justify-center gap-2 bg-error-container/20 px-4 py-2 rounded-lg border border-destructive">
                    <Icon name="warning" className="text-destructive text-sm" />
                    <span className="text-xs text-destructive font-semibold">Negative Cycle Detected!</span>
                  </div>
                )}
              </div>

              {/* Controls Footer */}
              <div className="mt-auto pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevious}
                    disabled={state.currentStep === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-line hover:bg-fg/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Icon name="skip_previous" />
                  </button>
                  <button
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-negative text-bg hover:brightness-110 transition-all shadow-lg shadow-negative/20"
                  >
                    <Icon name={isPlaying ? 'pause' : 'play_arrow'} />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={state.currentStep >= state.totalSteps - 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-line hover:bg-fg/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Icon name="skip_next" />
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-xs text-fg-2 uppercase tracking-widest mb-1">
                    Step {state.currentStep + 1} / {state.totalSteps}
                  </span>
                  <div className="w-28 sm:w-48 h-1.5 bg-fg/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-negative rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Center Panel (Logic/Memory) */}
          <section className="flex-1 flex flex-col gap-4 min-w-0 lg:min-w-[320px]">
            {/* Operation Status */}
            <div className="glass-panel rounded-xl p-5 border-l-4 border-l-negative">
              <h3 className="font-display text-lg mb-2 capitalize">{currentStep.action}</h3>
              <p className="font-sans text-fg-2 leading-relaxed">{currentStep.description}</p>
            </div>

            {/* Memory Inspector */}
            <div className="glass-panel rounded-xl p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono uppercase tracking-tighter text-fg-2">Memory Inspector</h3>
                <Icon name="memory" className="text-sm opacity-40" />
              </div>
              <div className="space-y-3">
                <div className="bg-bg p-3 rounded-lg border border-line">
                  <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                    Iteration
                  </span>
                  <span className="font-mono text-negative">{variables.iteration ?? 0} / {variables.totalIterations ?? graph.vertices - 1}</span>
                </div>
                <div className="bg-bg p-3 rounded-lg border border-line">
                  <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                    Current Edge
                  </span>
                  <span className="font-mono text-negative">
                    {variables.from !== undefined && variables.to !== undefined ? `${variables.from} → ${variables.to}` : '-'}
                  </span>
                </div>
                <div className="bg-bg p-3 rounded-lg border border-line">
                  <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                    Edge Weight
                  </span>
                  <span className={`font-mono ${variables.weight && variables.weight < 0 ? 'text-destructive' : 'text-negative'}`}>
                    {variables.weight ?? '-'}
                  </span>
                </div>
                <div className="bg-bg p-3 rounded-lg border border-line max-h-32 overflow-auto">
                  <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                    Distances
                  </span>
                  <div className="font-mono text-fg-2 text-xs space-y-1">
                    {Object.entries(distances as Record<string, number>).map(([v, d]) => (
                      <div key={v}>v{v}: {d === Infinity ? '∞' : d}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Complexity Info */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-mono uppercase tracking-tighter text-fg-2 mb-3">Complexity</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-fg-2 block mb-1">Time</span>
                  <span className="font-mono text-negative">O(VE)</span>
                </div>
                <div>
                  <span className="text-xs text-fg-2 block mb-1">Space</span>
                  <span className="font-mono text-negative">O(V)</span>
                </div>
              </div>
              <p className="text-xs text-fg-2 mt-2">
                V = vertices, E = edges
              </p>
            </div>
          </section>

          {/* Right Panel (Code) */}
          <section className="flex-1 flex flex-col gap-4 min-w-0 lg:min-w-[320px]">
            <div className="glass-panel rounded-xl p-5 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono uppercase tracking-tighter text-fg-2">Code</h3>
                <Icon name="code" className="text-sm opacity-40" />
              </div>
              <pre className="flex-1 overflow-auto text-xs font-mono text-fg-2 leading-relaxed">
                <code>{`function bellmanFord(graph, start) {
  const dist = new Map();
  const V = graph.vertices;
  
  // Initialize distances
  for (let v = 0; v < V; v++) {
    dist.set(v, v === start ? 0 : Infinity);
  }
  
  // Relax edges V-1 times
  for (let i = 0; i < V - 1; i++) {
    for (const [u, neighbors] of graph.edges) {
      for (const [v, weight] of neighbors) {
        if (dist.get(u) + weight < dist.get(v)) {
          dist.set(v, dist.get(u) + weight);
        }
      }
    }
  }
  
  // Check for negative cycles
  for (const [u, neighbors] of graph.edges) {
    for (const [v, weight] of neighbors) {
      if (dist.get(u) + weight < dist.get(v)) {
        return "Negative cycle detected";
      }
    }
  }
  
  return dist;
}

// Time: O(VE) - check all edges V times
// Space: O(V) - distance array`}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
