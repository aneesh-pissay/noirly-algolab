'use client';

import { useEffect, useState } from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { jumpSearch } from '@/src/core/algorithms/searching/jumpSearch';
import { AlgorithmStep, VisualizerState } from '@/src/core/engine/types';

import { Icon } from '@/src/components/Icon';
export default function JumpSearchPage() {
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Register and execute algorithm
    visualizerEngine.registerAlgorithm('jump-search', jumpSearch);
    visualizerEngine.execute('jump-search', {
      array: [2, 5, 8, 12, 16, 23, 38, 45, 56, 67, 78],
      target: 23
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

  const arrayData = currentStep.visualizationData?.array || [];
  const target = currentStep.visualizationData?.target ?? 0;
  const foundIndex = currentStep.visualizationData?.foundIndex;
  const highlights = currentStep.highlights || [];
  const variables = currentStep.variables || {};
  const isPlaying = state.isPlaying;
  const progress = ((state.currentStep + 1) / state.totalSteps) * 100;

  return (
    <>

      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        <div className="p-4">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Learning Path', href: '/learn-path' },
              { label: 'Jump Search' },
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
                  <Icon name="visibility" className="text-accent" />
                  Array Visualization
                </h2>
                <div className="flex items-center gap-2 bg-bg/50 px-4 py-2 rounded-lg border border-line">
                  <Icon name="search" className="text-sm text-fg-2" />
                  <span className="font-mono text-fg">Target: <span className="font-mono text-accent">{target}</span></span>
                </div>
              </div>

              {/* Array Blocks Canvas - Dynamic */}
              <div className="flex-1 flex items-center justify-center gap-3 relative overflow-x-auto px-4">
                {arrayData.map((value: number, index: number) => {
                  const isHighlighted = highlights.includes(index);
                  const isFound = foundIndex === index;
                  const showPrev = variables.prev === index;
                  const showCurr = variables.curr === index;
                  const showI = variables.i === index;

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center gap-4 transition-all duration-500 ${
                        isFound ? 'transform scale-110' : isHighlighted ? 'opacity-100' : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`w-16 h-20 rounded-xl flex items-center justify-center relative ${
                          isFound
                            ? 'bg-tertiary-container/20 border-2 border-negative shadow-[0_0_20px_var(--accent-soft)]'
                            : isHighlighted
                            ? 'bg-accent/20 border-2 border-accent'
                            : 'bg-surface-2 border border-line'
                        }`}
                      >
                        <span
                          className={`font-display text-2xl ${
                            isFound ? 'text-negative' : isHighlighted ? 'text-accent' : 'text-fg'
                          }`}
                        >
                          {value}
                        </span>
                        {/* Pointer prev */}
                        {showPrev && (
                          <div 
                            className={`absolute -top-10 flex flex-col items-center ${
                              (showPrev && showCurr) || (showPrev && showI)
                                ? 'left-1/4 -translate-x-1/2' 
                                : 'left-1/2 -translate-x-1/2'
                            }`}
                          >
                            <span className="font-mono text-fg-2 text-sm font-bold mb-1">prev</span>
                            <Icon name="arrow_drop_down" className="text-fg-2 text-2xl" />
                          </div>
                        )}
                        {/* Pointer curr */}
                        {showCurr && (
                          <div 
                            className={`absolute -top-10 flex flex-col items-center ${
                              showPrev && showCurr
                                ? 'left-3/4 -translate-x-1/2' 
                                : 'left-1/2 -translate-x-1/2'
                            }`}
                          >
                            <span className="font-mono text-accent text-sm font-bold mb-1">curr</span>
                            <Icon name="arrow_drop_down" className="text-accent text-2xl" />
                          </div>
                        )}
                        {/* Pointer i */}
                        {showI && (
                          <div 
                            className={`absolute -top-10 flex flex-col items-center ${
                              showPrev && showI
                                ? 'left-3/4 -translate-x-1/2' 
                                : 'left-1/2 -translate-x-1/2'
                            }`}
                          >
                            <span className="font-mono text-negative text-sm font-bold mb-1">i</span>
                            <Icon name="arrow_drop_down" className="text-negative text-2xl" />
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-xs text-fg-2">
                        [{index}]
                      </span>
                    </div>
                  );
                })}
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Step Size
                    </span>
                    <span className="font-mono text-accent">{variables.step ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Array Size (n)
                    </span>
                    <span className="font-mono text-accent">{variables.n ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Previous Index
                    </span>
                    <span className="font-mono text-fg-2">{variables.prev ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Current Index
                    </span>
                    <span className="font-mono text-accent">{variables.curr ?? '-'}</span>
                  </div>
                </div>
                {foundIndex !== undefined && (
                  <div className={`p-3 rounded-lg border-2 ${
                    foundIndex >= 0 ? 'bg-tertiary-container/10 border-negative' : 'bg-error-container/10 border-destructive'
                  }`}>
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Result
                    </span>
                    <span className={`font-mono ${foundIndex >= 0 ? 'text-negative' : 'text-destructive'}`}>
                      {foundIndex >= 0 ? `Found at index ${foundIndex}` : 'Not Found'}
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
                  <span className="font-mono text-accent">O(√n)</span>
                </div>
                <div>
                  <span className="text-xs text-fg-2 block mb-1">Space</span>
                  <span className="font-mono text-accent">O(1)</span>
                </div>
              </div>
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
                <code>{`function jumpSearch(arr, target) {
  const n = arr.length;
  const step = Math.floor(Math.sqrt(n));
  let prev = 0;
  
  // Jump through array
  while (arr[Math.min(step, n)-1] < target) {
    prev = step;
    step += Math.floor(Math.sqrt(n));
    if (prev >= n) return -1;
  }
  
  // Linear search in block
  for (let i = prev; i < Math.min(step, n); i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  
  return -1;
}`}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
