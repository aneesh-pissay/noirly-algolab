'use client';

import { useEffect, useState } from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { interpolationSearch } from '@/src/core/algorithms/searching/interpolationSearch';
import { AlgorithmStep, VisualizerState } from '@/src/core/engine/types';

import { Icon } from '@/src/components/Icon';
export default function InterpolationSearchPage() {
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Register and execute algorithm
    visualizerEngine.registerAlgorithm('interpolation-search', interpolationSearch);
    visualizerEngine.execute('interpolation-search', {
      array: [10, 20, 30, 40, 50, 60, 70, 80, 90],
      target: 50
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
              { label: 'Interpolation Search' },
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
                  const showLow = variables.low === index;
                  const showHigh = variables.high === index;
                  const showPos = variables.pos === index;

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
                        {/* Pointer low */}
                        {showLow && (
                          <div className="absolute -bottom-12 flex flex-col items-center left-1/2 -translate-x-1/2">
                            <Icon name="arrow_drop_up" className="text-fg-2 text-2xl" />
                            <span className="font-mono text-fg-2 text-sm font-bold">low</span>
                          </div>
                        )}
                        {/* Pointer high */}
                        {showHigh && (
                          <div className="absolute -bottom-12 flex flex-col items-center left-1/2 -translate-x-1/2">
                            <Icon name="arrow_drop_up" className="text-destructive text-2xl" />
                            <span className="font-mono text-destructive text-sm font-bold">high</span>
                          </div>
                        )}
                        {/* Pointer pos */}
                        {showPos && (
                          <div className="absolute -top-10 flex flex-col items-center left-1/2 -translate-x-1/2">
                            <span className="font-mono text-accent text-sm font-bold mb-1">pos</span>
                            <Icon name="arrow_drop_down" className="text-accent text-2xl" />
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
                      Low Index
                    </span>
                    <span className="font-mono text-fg-2">{variables.low ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      High Index
                    </span>
                    <span className="font-mono text-destructive">{variables.high ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line col-span-2">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Interpolated Position
                    </span>
                    <span className="font-mono text-accent">{variables.pos ?? '-'}</span>
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
                  <span className="font-mono text-accent">O(log log n)</span>
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
                <code>{`function interpolationSearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high && 
         target >= arr[low] && 
         target <= arr[high]) {
    if (low === high) {
      return arr[low] === target ? low : -1;
    }
    
    // Interpolation formula
    const pos = low + Math.floor(
      ((target - arr[low]) * (high - low)) / 
      (arr[high] - arr[low])
    );
    
    if (arr[pos] === target) return pos;
    
    if (arr[pos] < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
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
