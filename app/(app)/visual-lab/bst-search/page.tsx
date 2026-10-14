'use client';

import { useEffect, useState } from 'react';
import React from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { bstSearch } from '@/src/core/algorithms/trees/bstSearch';
import { AlgorithmStep, VisualizerState, TreeNode } from '@/src/core/engine/types';

import { Icon } from '@/src/components/Icon';
// Sample BST for demonstration
const sampleBST: TreeNode = {
  value: 50,
  left: {
    value: 30,
    left: { value: 20 },
    right: { value: 40 },
  },
  right: {
    value: 70,
    left: { value: 60 },
    right: { value: 80 },
  },
};

export default function BSTSearchPage() {
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Register and execute algorithm
    visualizerEngine.registerAlgorithm('bst-search', bstSearch);
    visualizerEngine.execute('bst-search', {
      tree: sampleBST,
      target: 40
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

  const tree = currentStep.visualizationData?.tree;
  const target = currentStep.visualizationData?.target ?? 0;
  const currentNode = currentStep.visualizationData?.currentNode;
  const path = currentStep.visualizationData?.path || [];
  const found = currentStep.visualizationData?.found;
  const highlights = currentStep.highlights || [];
  const variables = currentStep.variables || {};
  const isPlaying = state.isPlaying;
  const progress = ((state.currentStep + 1) / state.totalSteps) * 100;

  // Recursive tree renderer
  const renderTree = (node: TreeNode | undefined, x: number, y: number, xOffset: number, level: number) => {
    if (!node) return null;

    const isHighlighted = highlights.includes(node.value);
    const isCurrent = currentNode?.value === node.value;
    const isInPath = path.includes(node.value);
    const isFound = found && currentNode?.value === node.value;

    return (
      <g key={`${node.value}-${x}-${y}`}>
        {/* Lines to children */}
        {node.left && (
          <line
            x1={x}
            y1={y}
            x2={x - xOffset}
            y2={y + 80}
            stroke={isInPath ? 'var(--accent)' : 'var(--hairline-strong)'}
            strokeWidth={isInPath ? '3' : '2'}
            opacity={isInPath ? 1 : 0.3}
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y}
            x2={x + xOffset}
            y2={y + 80}
            stroke={isInPath ? 'var(--accent)' : 'var(--hairline-strong)'}
            strokeWidth={isInPath ? '3' : '2'}
            opacity={isInPath ? 1 : 0.3}
          />
        )}

        {/* Node circle */}
        <circle
          cx={x}
          cy={y}
          r="28"
          fill={isFound ? 'var(--positive)' : isHighlighted || isCurrent ? 'var(--accent)' : 'var(--surface-2)'}
          stroke={isFound ? 'var(--positive)' : isHighlighted || isCurrent ? 'var(--accent)' : 'var(--hairline-strong)'}
          strokeWidth="3"
          className="transition-all duration-300"
          style={{
            filter: isHighlighted || isCurrent ? 'drop-shadow(0 0 12px color-mix(in srgb, var(--accent) 60%, transparent))' : 'none'
          }}
        />
        
        {/* Node value */}
        <text
          x={x}
          y={y + 6}
          textAnchor="middle"
          fill="white"
          fontSize="18"
          fontWeight="bold"
        >
          {node.value}
        </text>

        {/* Recursively render children */}
        {renderTree(node.left, x - xOffset, y + 80, xOffset / 2, level + 1)}
        {renderTree(node.right, x + xOffset, y + 80, xOffset / 2, level + 1)}
      </g>
    );
  };

  return (
    <>

      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        <div className="p-4">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Learning Path', href: '/learn-path' },
              { label: 'BST Search' },
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
                  <Icon name="account_tree" className="text-accent" />
                  Binary Search Tree
                </h2>
                <div className="flex items-center gap-2 bg-bg/50 px-4 py-2 rounded-lg border border-line">
                  <Icon name="search" className="text-sm text-fg-2" />
                  <span className="font-mono text-fg">Target: <span className="font-mono text-accent">{target}</span></span>
                </div>
              </div>

              {/* Tree Visualization */}
              <div className="flex-1 flex items-center justify-center relative overflow-auto">
                <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
                  {tree && renderTree(tree, 400, 50, 120, 0)}
                </svg>
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
                    Current Node
                  </span>
                  <span className="font-mono text-accent">{variables.currentValue ?? '-'}</span>
                </div>
                <div className="bg-bg p-3 rounded-lg border border-line">
                  <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                    Search Path
                  </span>
                  <span className="font-mono text-fg-2">
                    {variables.path && variables.path.length > 0 ? `[${variables.path.join(' → ')}]` : '-'}
                  </span>
                </div>
                {found !== undefined && (
                  <div className={`p-3 rounded-lg border-2 ${
                    found ? 'bg-tertiary-container/10 border-negative' : 'bg-error-container/10 border-destructive'
                  }`}>
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Result
                    </span>
                    <span className={`font-mono ${found ? 'text-negative' : 'text-destructive'}`}>
                      {found ? `Found: ${variables.currentValue}` : 'Not Found'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Complexity Info */}
            <div className="glass-panel rounded-xl p-5">
              <h3 className="font-mono uppercase tracking-tighter text-fg-2 mb-3">Complexity</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-fg-2 block mb-1">Time</span>
                  <span className="font-mono text-accent">O(h)</span>
                </div>
                <div>
                  <span className="text-xs text-fg-2 block mb-1">Space</span>
                  <span className="font-mono text-accent">O(1)</span>
                </div>
              </div>
              <p className="text-xs text-fg-2 mt-2">
                h = height of tree (log n average, n worst)
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
                <code>{`function bstSearch(root, target) {
  let current = root;
  
  while (current !== null) {
    // Check current node
    if (current.value === target) {
      return current; // Found!
    }
    
    // Go left or right based on BST property
    if (target < current.value) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  
  return null; // Not found
}

// Time: O(h) where h is tree height
// Space: O(1) iterative`}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
