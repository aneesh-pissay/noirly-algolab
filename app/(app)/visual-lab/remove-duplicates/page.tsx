'use client';

import { useEffect, useState } from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { removeDuplicates } from '@/src/core/algorithms/two-pointers/removeDuplicates';
import { AlgorithmStep, VisualizerState } from '@/src/core/engine/types';

import { Icon } from '@/src/components/Icon';
export default function RemoveDuplicatesPage() {
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    visualizerEngine.registerAlgorithm('remove-duplicates', removeDuplicates);
    visualizerEngine.execute('remove-duplicates', {
      array: [1, 1, 1, 2, 2, 3, 4, 4, 5, 5, 5]
    });

    const unsubscribe = visualizerEngine.subscribe((newState) => {
      setState(newState);
      setCurrentStep(visualizerEngine.getCurrentStep());
    });

    setState(visualizerEngine.getState());
    setCurrentStep(visualizerEngine.getCurrentStep());
    setIsInitialized(true);

    return () => unsubscribe();
  }, []);

  const handlePlay = () => visualizerEngine.play();
  const handlePause = () => visualizerEngine.pause();
  const handleNext = () => visualizerEngine.nextStep();
  const handlePrevious = () => visualizerEngine.previousStep();

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
  const uniquePointer = currentStep.visualizationData?.uniquePointer ?? -1;
  const scanPointer = currentStep.visualizationData?.scanPointer ?? -1;
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
              { label: 'Remove Duplicates' },
            ]}
          />
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 gap-4 pt-0">
          <section className="flex-[1.5] flex flex-col gap-4 min-w-0">
            <div className="glass-panel rounded-xl p-6 flex flex-col flex-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-lg flex items-center gap-2">
                  <Icon name="filter_list" className="text-accent" />
                  Array Visualization
                </h2>
                <div className="flex items-center gap-3 bg-negative/10 p-2 px-4 rounded-lg border border-negative/20">
                  <span className="text-xs text-fg-2">Unique:</span>
                  <span className="text-xl font-display text-negative">{variables.uniqueCount || 0}</span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center gap-4 relative flex-wrap">
                {arrayData.map((value: number, index: number) => {
                  const isHighlighted = highlights.includes(index);
                  const showUnique = uniquePointer === index;
                  const showScan = scanPointer === index;
                  const isUnique = index <= uniquePointer;

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center gap-4 transition-all duration-500 ${
                        isHighlighted ? 'transform scale-110' : isUnique ? '' : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`w-20 h-24 rounded-xl flex items-center justify-center relative ${
                          isHighlighted
                            ? 'bg-negative/20 border-2 border-negative shadow-[0_0_20px_var(--accent-soft)]'
                            : isUnique
                            ? 'bg-accent/10 border-2 border-accent/50'
                            : 'bg-surface-2 border border-line'
                        }`}
                      >
                        <span
                          className={`font-display text-3xl ${
                            isHighlighted ? 'text-negative' : isUnique ? 'text-accent' : 'text-fg-2'
                          }`}
                        >
                          {value}
                        </span>
                        {showUnique && (
                          <div className={`absolute -top-10 flex flex-col items-center ${
                              showUnique && showScan ? 'left-1/4 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'
                            }`}>
                            <span className="font-mono text-accent text-sm font-bold mb-1">unique</span>
                            <Icon name="arrow_drop_down" className="text-accent text-2xl" />
                          </div>
                        )}
                        {showScan && (
                          <div className={`absolute -top-10 flex flex-col items-center ${
                              showUnique && showScan ? 'left-3/4 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'
                            }`}>
                            <span className="font-mono text-negative text-sm font-bold mb-1">scan</span>
                            <Icon name="arrow_drop_down" className="text-negative text-2xl" />
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-xs text-fg-2">
                        index [{index}]
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto pt-6 border-t border-line flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <button onClick={handlePrevious} disabled={state.currentStep === 0} className="w-10 h-10 flex items-center justify-center rounded-lg border border-line hover:bg-fg/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <Icon name="skip_previous" />
                  </button>
                  <button onClick={isPlaying ? handlePause : handlePlay} className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent text-accent-ink hover:brightness-110 transition-all shadow-lg shadow-accent/20">
                    <Icon name={isPlaying ? 'pause' : 'play_arrow'} />
                  </button>
                  <button onClick={handleNext} disabled={state.currentStep >= state.totalSteps - 1} className="w-10 h-10 flex items-center justify-center rounded-lg border border-line hover:bg-fg/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <Icon name="skip_next" />
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-xs text-fg-2 uppercase tracking-widest mb-1">
                    Step {state.currentStep + 1} / {state.totalSteps}
                  </span>
                  <div className="w-28 sm:w-48 h-1.5 bg-fg/10 rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 flex flex-col gap-4 min-w-0 lg:min-w-[320px]">
            <div className="glass-panel rounded-xl p-5 border-l-4 border-l-negative">
              <h3 className="font-display text-lg mb-2 capitalize">{currentStep.action}</h3>
              <p className="font-sans text-fg-2 leading-relaxed">{currentStep.description}</p>
            </div>

            <div className="glass-panel rounded-xl p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono uppercase tracking-tighter text-fg-2">Memory Inspector</h3>
                <Icon name="memory" className="text-sm opacity-40" />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">Unique Ptr</span>
                    <span className="font-mono text-accent">{variables.uniquePointer ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">Scan Ptr</span>
                    <span className="font-mono text-accent">{variables.scanPointer ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line col-span-2">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">Unique Count</span>
                    <span className="font-mono text-negative">{variables.uniqueCount ?? 0}</span>
                  </div>
                </div>
                <div className="space-y-2 mt-4 pt-4 border-t border-line">
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">Array Length</span>
                    <span className="text-fg font-mono">{arrayData.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">Current State</span>
                    <span className="text-fg font-mono text-xs">[{arrayData.join(', ')}]</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-2/40 rounded-xl p-5 border border-line">
              <h4 className="font-mono text-xs text-accent uppercase mb-3 tracking-widest">Complexity</h4>
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="text-[10px] text-fg-2 uppercase block">Time</span>
                  <span className="font-mono text-lg">O(n)</span>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-fg-2 uppercase block">Space</span>
                  <span className="font-mono text-lg">O(1)</span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex-1 flex flex-col min-w-0 lg:min-w-[380px]">
            <div className="glass-panel rounded-xl flex-1 flex flex-col overflow-hidden">
              <div className="flex bg-bg/80 border-b border-line">
                <button className="px-4 py-2.5 border-b-2 border-negative bg-surface-2 text-fg text-xs font-mono flex items-center gap-2">
                  <span className="w-3 h-3 bg-negative rounded-sm"></span>
                  removeDuplicates.js
                </button>
              </div>

              <div className="flex-1 font-mono text-[13px] leading-6 p-4 overflow-auto bg-bg/30">
                <div className="flex gap-4">
                  <div className="text-fg-3 text-right select-none pr-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((lineNum) => (
                      <div key={lineNum}>{lineNum}</div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <div><span className="text-accent">function</span> <span className="text-negative">removeDuplicates</span>(arr) &#123;</div>
                    <div>&nbsp;&nbsp;<span className="text-accent">if</span> (arr.length === <span className="text-negative">0</span>) <span className="text-accent">return</span> <span className="text-negative">0</span>;</div>
                    <div>&nbsp;&nbsp;<span className="text-accent">let</span> unique = <span className="text-negative">0</span>;</div>
                    <div>&nbsp;&nbsp;<span className="text-accent">for</span> (<span className="text-accent">let</span> scan = <span className="text-negative">1</span>; scan &lt; arr.length; scan++) &#123;</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">if</span> (arr[scan] !== arr[unique]) &#123;</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;unique++;</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arr[unique] = arr[scan];</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&#125;</div>
                    <div>&nbsp;&nbsp;&#125;</div>
                    <div>&nbsp;&nbsp;<span className="text-accent">return</span> unique + <span className="text-negative">1</span>;</div>
                    <div>&#125;</div>
                  </div>
                </div>
              </div>

              <div className="bg-surface px-4 py-1.5 border-t border-line flex justify-between items-center text-[10px] font-mono text-fg-3">
                <div className="flex items-center gap-4">
                  <span>UTF-8</span>
                  <span>JavaScript</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Ln {currentStep.codeLine || 1}, Col 1</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent"></span> Prettier
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
