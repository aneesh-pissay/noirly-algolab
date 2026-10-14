'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { aStar } from '@/src/core/algorithms/graphs/aStar';
import { AlgorithmStep, VisualizerState, Graph } from '@/src/core/engine/types';

import { Icon } from '@/src/components/Icon';
// Sample weighted graph for demonstration
const sampleGraph: Graph = {
  vertices: 6,
  edges: new Map([
    [0, [1, 2]],
    [1, [0, 2, 3]],
    [2, [0, 1, 3, 4]],
    [3, [1, 2, 4, 5]],
    [4, [2, 3, 5]],
    [5, [3, 4]],
  ]),
  weighted: true,
  weights: new Map([
    ['0-1', 4],
    ['1-0', 4],
    ['0-2', 2],
    ['2-0', 2],
    ['1-2', 1],
    ['2-1', 1],
    ['1-3', 5],
    ['3-1', 5],
    ['2-3', 8],
    ['3-2', 8],
    ['2-4', 10],
    ['4-2', 10],
    ['3-4', 2],
    ['4-3', 2],
    ['3-5', 6],
    ['5-3', 6],
    ['4-5', 3],
    ['5-4', 3],
  ]),
};

export default function AStarPage() {
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Register and execute algorithm
    visualizerEngine.registerAlgorithm('a-star', aStar);
    visualizerEngine.execute('a-star', {
      graph: sampleGraph,
      startVertex: 0,
      targetVertex: 5
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
  const targetVertex = currentStep.visualizationData?.targetVertex ?? 5;
  const startVertex = currentStep.visualizationData?.startVertex ?? 0;
  const visited = currentStep.visualizationData?.visited || [];
  const openSet = currentStep.visualizationData?.openSet || [];
  const gScore = currentStep.visualizationData?.gScore || {};
  const fScore = currentStep.visualizationData?.fScore || {};
  const exploringEdge = currentStep.visualizationData?.exploringEdge;
  const highlights = currentStep.highlights || [];
  const variables = currentStep.variables || {};
  const isPlaying = state.isPlaying;
  const progress = ((state.currentStep + 1) / state.totalSteps) * 100;

  // Graph layout positions
  const positions: { [key: number]: { x: number; y: number } } = {
    0: { x: 100, y: 200 },
    1: { x: 200, y: 100 },
    2: { x: 200, y: 300 },
    3: { x: 350, y: 150 },
    4: { x: 350, y: 350 },
    5: { x: 500, y: 250 },
  };

  return (
    <>

      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        <div className="p-4">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Learning Path', href: '/learn-path' },
              { label: 'A* Search' },
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
                  <Icon name="explore" className="text-accent" />
                  A* Pathfinding
                </h2>
                <div className="flex items-center gap-2 bg-bg/50 px-4 py-2 rounded-lg border border-line">
                  <Icon name="psychology" className="text-sm text-fg-2" />
                  <span className="font-mono text-fg">Heuristic Search</span>
                </div>
              </div>

              {/* Graph Visualization */}
              <div className="flex-1 flex items-center justify-center relative overflow-auto">
                <svg width="100%" height="100%" viewBox="0 0 600 450" preserveAspectRatio="xMidYMid meet">
                  {/* Draw edges with weights */}
                  {[...graph.edges.entries()].map(([from, toList]) =>
                    toList.map((to: number) => {
                      if (from < to) {
                        const isExploring = exploringEdge && ((exploringEdge[0] === from && exploringEdge[1] === to) || (exploringEdge[0] === to && exploringEdge[1] === from));
                        const edgeKey = `${from}-${to}`;
                        const weight = graph.weights?.get(edgeKey) || 0;
                        const midX = (positions[from].x + positions[to].x) / 2;
                        const midY = (positions[from].y + positions[to].y) / 2;

                        return (
                          <g key={`${from}-${to}`}>
                            <line
                              x1={positions[from].x}
                              y1={positions[from].y}
                              x2={positions[to].x}
                              y2={positions[to].y}
                              stroke={isExploring ? 'var(--accent)' : 'var(--hairline-strong)'}
                              strokeWidth={isExploring ? '3' : '2'}
                              opacity={isExploring ? 1 : 0.3}
                              className="transition-all duration-300"
                            />
                            <circle cx={midX} cy={midY} r="12" fill="var(--surface-2)" stroke="var(--hairline-strong)" strokeWidth="1" />
                            <text
                              x={midX}
                              y={midY + 4}
                              textAnchor="middle"
                              fill="var(--accent)"
                              fontSize="11"
                              fontWeight="bold"
                            >
                              {weight}
                            </text>
                          </g>
                        );
                      }
                      return null;
                    })
                  )}

                  {/* Draw vertices */}
                  {Array.from({ length: graph.vertices }).map((_, v) => {
                    const isVisited = visited.includes(v);
                    const isCurrent = currentVertex === v;
                    const isInOpen = openSet.includes(v);
                    const isStart = v === startVertex;
                    const isTarget = v === targetVertex;
                    const isHighlighted = highlights.includes(v);
                    const f = fScore[v] !== undefined ? (fScore[v] === Infinity ? '∞' : fScore[v]) : '∞';

                    return (
                      <g key={v}>
                        <circle
                          cx={positions[v].x}
                          cy={positions[v].y}
                          r="28"
                          fill={isTarget ? 'var(--negative)' : isStart ? 'var(--accent)' : isCurrent ? 'var(--accent)' : isVisited ? 'var(--accent)' : isInOpen ? 'var(--surface-2)' : 'var(--surface-2)'}
                          stroke={isHighlighted ? 'var(--accent)' : 'var(--hairline-strong)'}
                          strokeWidth="3"
                          className="transition-all duration-300"
                          style={{
                            filter: isHighlighted ? 'drop-shadow(0 0 12px color-mix(in srgb, var(--accent) 60%, transparent))' : 'none'
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
                          fill="var(--accent)"
                          fontSize="12"
                          fontWeight="bold"
                        >
                          f={f}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mb-4 justify-center flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent"></div>
                  <span className="text-xs text-fg-2">Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-negative"></div>
                  <span className="text-xs text-fg-2">Target</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent"></div>
                  <span className="text-xs text-fg-2">Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent"></div>
                  <span className="text-xs text-fg-2">Visited</span>
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
                    Current → Target
                  </span>
                  <span className="font-mono text-accent">{variables.currentVertex ?? '-'} → {targetVertex}</span>
                </div>
                <div className="bg-bg p-3 rounded-lg border border-line">
                  <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                    g(n) | h(n) | f(n)
                  </span>
                  <span className="font-mono text-accent">
                    {variables.gCost ?? '-'} | {variables.hCost ?? '-'} | {variables.fCost ?? '-'}
                  </span>
                </div>
                <div className="bg-bg p-3 rounded-lg border border-line">
                  <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                    Open Set Size
                  </span>
                  <span className="font-mono text-negative">{variables.openSetSize ?? openSet.length}</span>
                </div>
              </div>
            </div>

            {/* Complexity Info */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-mono uppercase tracking-tighter text-fg-2 mb-3">Complexity</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-fg-2 block mb-1">Time</span>
                  <span className="font-mono text-accent">O(E log V)</span>
                </div>
                <div>
                  <span className="text-xs text-fg-2 block mb-1">Space</span>
                  <span className="font-mono text-accent">O(V)</span>
                </div>
              </div>
              <p className="text-xs text-fg-2 mt-2">
                f(n) = g(n) + h(n)
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
                <code>{`function aStar(graph, start, target, h) {
  const gScore = new Map(); // Cost from start
  const fScore = new Map(); // gScore + heuristic
  const openSet = new Set([start]);
  
  gScore.set(start, 0);
  fScore.set(start, h(start, target));
  
  while (openSet.size > 0) {
    // Get node with lowest f score
    let current = getLowestF(openSet, fScore);
    
    if (current === target) {
      return reconstructPath(current);
    }
    
    openSet.delete(current);
    
    for (const [neighbor, weight] of graph[current]) {
      const tentativeG = gScore.get(current) + weight;
      
      if (tentativeG < gScore.get(neighbor)) {
        gScore.set(neighbor, tentativeG);
        fScore.set(neighbor, tentativeG + h(neighbor, target));
        openSet.add(neighbor);
      }
    }
  }
}

// Time: O(E log V) with priority queue
// Space: O(V)`}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
