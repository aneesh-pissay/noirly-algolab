'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { graphBFS } from '@/src/core/algorithms/graphs/graphBFS';
import { AlgorithmStep, VisualizerState, Graph } from '@/src/core/engine/types';

import { Icon } from '@/src/components/Icon';
// Sample graph for demonstration
const sampleGraph: Graph = {
  vertices: 7,
  edges: new Map([
    [0, [1, 2]],
    [1, [0, 3, 4]],
    [2, [0, 5, 6]],
    [3, [1]],
    [4, [1]],
    [5, [2]],
    [6, [2]],
  ]),
};

export default function BFSPage() {
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Register and execute algorithm
    visualizerEngine.registerAlgorithm('graph-bfs', graphBFS);
    visualizerEngine.execute('graph-bfs', {
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
  const visited = currentStep.visualizationData?.visited || [];
  const queue = currentStep.visualizationData?.queue || [];
  const visitOrder = currentStep.visualizationData?.visitOrder || [];
  const exploringEdge = currentStep.visualizationData?.exploringEdge;
  const highlights = currentStep.highlights || [];
  const variables = currentStep.variables || {};
  const isPlaying = state.isPlaying;
  const progress = ((state.currentStep + 1) / state.totalSteps) * 100;

  // Graph layout positions (simple grid layout)
  const positions: { [key: number]: { x: number; y: number } } = {
    0: { x: 200, y: 150 },
    1: { x: 100, y: 250 },
    2: { x: 300, y: 250 },
    3: { x: 50, y: 350 },
    4: { x: 150, y: 350 },
    5: { x: 250, y: 350 },
    6: { x: 350, y: 350 },
  };

  return (
    <>

      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        <div className="p-4">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Learning Path', href: '/learn-path' },
              { label: 'BFS' },
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
                  <Icon name="device_hub" className="text-accent" />
                  Breadth-First Search
                </h2>
                <div className="flex items-center gap-2 bg-bg/50 px-4 py-2 rounded-lg border border-line">
                  <Icon name="explore" className="text-sm text-fg-2" />
                  <span className="font-mono text-fg">Level-Order Traversal</span>
                </div>
              </div>

              {/* Graph Visualization */}
              <div className="flex-1 flex items-center justify-center relative overflow-auto">
                <svg width="100%" height="100%" viewBox="0 0 400 450" preserveAspectRatio="xMidYMid meet">
                  {/* Draw edges */}
                  {[...graph.edges.entries()].map(([from, toList]) =>
                    toList.map((to: number) => {
                      const isExploring = exploringEdge && ((exploringEdge[0] === from && exploringEdge[1] === to) || (exploringEdge[0] === to && exploringEdge[1] === from));
                      return (
                        <line
                          key={`${from}-${to}`}
                          x1={positions[from].x}
                          y1={positions[from].y}
                          x2={positions[to].x}
                          y2={positions[to].y}
                          stroke={isExploring ? 'var(--accent)' : 'var(--hairline-strong)'}
                          strokeWidth={isExploring ? '3' : '2'}
                          opacity={isExploring ? 1 : 0.3}
                          className="transition-all duration-300"
                        />
                      );
                    })
                  )}

                  {/* Draw vertices */}
                  {Array.from({ length: graph.vertices }).map((_, v) => {
                    const isVisited = visited.includes(v);
                    const isCurrent = currentVertex === v;
                    const isInQueue = queue.includes(v);
                    const isHighlighted = highlights.includes(v);

                    return (
                      <g key={v}>
                        <circle
                          cx={positions[v].x}
                          cy={positions[v].y}
                          r="25"
                          fill={isCurrent ? 'var(--accent)' : isVisited ? 'var(--positive)' : isInQueue ? 'var(--negative)' : 'var(--surface-2)'}
                          stroke={isHighlighted ? 'var(--accent)' : 'var(--hairline-strong)'}
                          strokeWidth="3"
                          className="transition-all duration-300"
                          style={{
                            filter: isHighlighted ? 'drop-shadow(0 0 12px color-mix(in srgb, var(--accent) 60%, transparent))' : 'none'
                          }}
                        />
                        <text
                          x={positions[v].x}
                          y={positions[v].y + 6}
                          textAnchor="middle"
                          fill="white"
                          fontSize="18"
                          fontWeight="bold"
                        >
                          {v}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mb-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent"></div>
                  <span className="text-xs text-fg-2">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-positive"></div>
                  <span className="text-xs text-fg-2">Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-negative"></div>
                  <span className="text-xs text-fg-2">In Queue</span>
                </div>
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
                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent text-accent-ink hover:brightness-110 transition-all shadow-lg shadow-accent/20"
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
                      className="h-full bg-accent rounded-full transition-all duration-300"
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
            <div className="glass-panel rounded-xl p-5 border-l-4 border-l-accent">
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
                    Current Vertex
                  </span>
                  <span className="font-mono text-accent">{variables.currentVertex ?? '-'}</span>
                </div>
                <div className="bg-bg p-3 rounded-lg border border-line">
                  <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                    Queue
                  </span>
                  <span className="font-mono text-negative">
                    {queue && queue.length > 0 ? `[${queue.join(', ')}]` : 'Empty'}
                  </span>
                </div>
                <div className="bg-bg p-3 rounded-lg border border-line">
                  <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                    Visited
                  </span>
                  <span className="font-mono text-negative">
                    {visited && visited.length > 0 ? `{${visited.join(', ')}}` : 'Empty'}
                  </span>
                </div>
                <div className="bg-bg p-3 rounded-lg border border-line">
                  <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                    Visit Order
                  </span>
                  <span className="font-mono text-fg-2">
                    {visitOrder && visitOrder.length > 0 ? `[${visitOrder.join(' → ')}]` : '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Complexity Info */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-mono uppercase tracking-tighter text-fg-2 mb-3">Complexity</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-fg-2 block mb-1">Time</span>
                  <span className="font-mono text-accent">O(V + E)</span>
                </div>
                <div>
                  <span className="text-xs text-fg-2 block mb-1">Space</span>
                  <span className="font-mono text-accent">O(V)</span>
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
                <code>{`function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const visitOrder = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    visitOrder.push(vertex);
    
    // Visit all neighbors
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return visitOrder;
}

// Time: O(V + E) - visit all vertices and edges
// Space: O(V) - queue and visited set`}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
