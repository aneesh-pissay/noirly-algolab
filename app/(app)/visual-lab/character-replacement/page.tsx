'use client';

import { useEffect, useState } from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { characterReplacement } from '@/src/core/algorithms/sliding-window/characterReplacement';
import { AlgorithmStep, VisualizerState } from '@/src/core/engine/types';

import { Icon } from '@/src/components/Icon';
export default function CharacterReplacementPage() {
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Register and execute algorithm
    visualizerEngine.registerAlgorithm('character-replacement', characterReplacement);
    visualizerEngine.execute('character-replacement', {
      str: 'AABABBA',
      k: 1
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

  const stringData = currentStep.visualizationData?.str || '';
  const charArray = stringData.split('');
  const windowStart = currentStep.visualizationData?.windowStart ?? -1;
  const windowEnd = currentStep.visualizationData?.windowEnd ?? -1;
  const maxLength = currentStep.visualizationData?.maxLength ?? 0;
  const maxCount = currentStep.visualizationData?.maxCount ?? 0;
  const k = currentStep.visualizationData?.k ?? 0;
  const charCount = currentStep.visualizationData?.charCount || {};
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
              { label: 'Character Replacement' },
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
                  String Visualization
                </h2>
                <div className="flex items-center gap-3 bg-bg/50 p-1 rounded-lg border border-line">
                  <button className="px-3 py-1 text-xs font-mono text-fg-2 hover:text-fg transition-colors">
                    0.5x
                  </button>
                  <button className="px-3 py-1 text-xs font-mono bg-accent text-accent-ink rounded-md">
                    1x
                  </button>
                  <button className="px-3 py-1 text-xs font-mono text-fg-2 hover:text-fg transition-colors">
                    2x
                  </button>
                </div>
              </div>

              {/* Stats Display */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="bg-bg p-4 rounded-lg border border-line">
                  <span className="text-xs text-fg-2 block mb-1">Max Length</span>
                  <span className="font-display text-2xl text-positive">{maxLength}</span>
                </div>
                <div className="bg-bg p-4 rounded-lg border border-line">
                  <span className="text-xs text-fg-2 block mb-1">Max Count</span>
                  <span className="font-display text-2xl text-accent">{maxCount}</span>
                </div>
                <div className="bg-bg p-4 rounded-lg border border-line">
                  <span className="text-xs text-fg-2 block mb-1">K Replacements</span>
                  <span className="font-display text-2xl text-negative">{k}</span>
                </div>
                <div className="bg-bg p-4 rounded-lg border border-line">
                  <span className="text-xs text-fg-2 block mb-1">Char Frequency</span>
                  <span className="font-mono text-xs text-accent">
                    {JSON.stringify(charCount)}
                  </span>
                </div>
              </div>

              {/* String Blocks Canvas */}
              <div className="flex-1 flex items-center justify-center gap-3 relative flex-wrap">
                {charArray.map((char: string, index: number) => {
                  const inWindow = index >= windowStart && index <= windowEnd && windowStart !== -1;
                  const isHighlighted = highlights.includes(index);
                  const showWindowStart = windowStart === index;
                  const showWindowEnd = windowEnd === index;

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center gap-4 transition-all duration-500 ${
                        inWindow ? 'transform scale-110' : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`w-16 h-20 rounded-xl flex items-center justify-center relative ${
                          inWindow
                            ? 'bg-accent/20 border-2 border-accent shadow-[0_0_20px_var(--accent-soft)]'
                            : 'bg-surface-2 border border-line'
                        }`}
                      >
                        <span
                          className={`font-mono text-2xl ${
                            inWindow ? 'text-accent' : 'text-fg'
                          }`}
                        >
                          '{char}'
                        </span>
                        {/* Window Start Pointer */}
                        {showWindowStart && (
                          <div className="absolute -top-10 flex flex-col items-center left-1/2 -translate-x-1/2">
                            <span className="font-mono text-accent text-sm font-bold mb-1">start</span>
                            <Icon name="arrow_drop_down" className="text-accent text-2xl" />
                          </div>
                        )}
                        {/* Window End Pointer */}
                        {showWindowEnd && (
                          <div className="absolute -bottom-10 flex flex-col items-center left-1/2 -translate-x-1/2">
                            <Icon name="arrow_drop_up" className="text-negative text-2xl" />
                            <span className="font-mono text-negative text-sm font-bold mt-1">end</span>
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      K
                    </span>
                    <span className="font-mono text-negative">{variables.k ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Window Start
                    </span>
                    <span className="font-mono text-accent">{variables.windowStart ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Window End
                    </span>
                    <span className="font-mono text-negative">{variables.windowEnd ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Max Count
                    </span>
                    <span className="font-mono text-accent">{variables.maxCount ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Max Length
                    </span>
                    <span className="font-mono text-positive">{variables.maxLength ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Replacements Needed
                    </span>
                    <span className="font-mono text-accent">{variables.replacementsNeeded ?? '-'}</span>
                  </div>
                </div>
                <div className="space-y-2 mt-4 pt-4 border-t border-line">
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">String Length</span>
                    <span className="text-fg font-mono">{charArray.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">Window Size</span>
                    <span className="text-fg font-mono">
                      {windowStart !== -1 && windowEnd !== -1 ? windowEnd - windowStart + 1 : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Complexity Card */}
            <div className="bg-surface-2/40 rounded-xl p-5 border border-line">
              <h4 className="font-mono text-xs text-accent uppercase mb-3 tracking-widest">Complexity</h4>
              <div className="flex gap-4">
                <div className="flex-1">
                  <span className="text-[10px] text-fg-2 uppercase block">Time</span>
                  <span className="font-mono text-lg">{currentStep.complexity?.time || 'O(n)'}</span>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-fg-2 uppercase block">Space</span>
                  <span className="font-mono text-lg">{currentStep.complexity?.space || 'O(1)'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel (Code Editor) */}
          <section className="flex-1 flex flex-col min-w-0 lg:min-w-[380px]">
            <div className="glass-panel rounded-xl flex-1 flex flex-col overflow-hidden">
              {/* Editor Tabs */}
              <div className="flex bg-bg/80 border-b border-line">
                <button className="px-4 py-2.5 border-b-2 border-accent bg-surface-2 text-fg text-xs font-mono flex items-center gap-2">
                  <span className="w-3 h-3 bg-accent rounded-sm"></span>
                  charReplace.js
                </button>
              </div>

              {/* Code Content */}
              <div className="flex-1 font-mono text-[13px] leading-6 p-4 overflow-auto bg-bg/30">
                <div className="flex gap-4">
                  <div className="text-fg-3 text-right select-none pr-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((lineNum) => (
                      <div key={lineNum}>{lineNum}</div>
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className={currentStep.codeLine === 1 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      <span className="text-accent">function</span>{' '}
                      <span className="text-negative">characterReplacement</span>(str, k) &#123;
                    </div>
                    <div className={currentStep.codeLine === 2 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;<span className="text-accent">let</span> windowStart = <span className="text-negative">0</span>, maxCount = <span className="text-negative">0</span>, maxLength = <span className="text-negative">0</span>;
                    </div>
                    <div className={currentStep.codeLine === 3 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;<span className="text-accent">const</span> charCount = &#123;&#125;;
                    </div>
                    <div className={currentStep.codeLine === 4 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;<span className="text-accent">for</span> (<span className="text-accent">let</span> windowEnd = <span className="text-negative">0</span>; windowEnd &lt; str.length; windowEnd++) &#123;
                    </div>
                    <div className={currentStep.codeLine === 5 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">const</span> rightChar = str[windowEnd];
                    </div>
                    <div className={currentStep.codeLine === 6 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;charCount[rightChar] = (charCount[rightChar] || <span className="text-negative">0</span>) + <span className="text-negative">1</span>;
                    </div>
                    <div className={currentStep.codeLine === 7 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;maxCount = Math.max(maxCount, charCount[rightChar]);
                    </div>
                    <div className={currentStep.codeLine === 8 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">if</span> ((windowEnd - windowStart + <span className="text-negative">1</span>) - maxCount &gt; k) &#123;
                    </div>
                    <div className={currentStep.codeLine === 9 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">const</span> leftChar = str[windowStart];
                    </div>
                    <div className={currentStep.codeLine === 10 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;charCount[leftChar]--; windowStart++;
                    </div>
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&#125;
                    </div>
                    <div className={currentStep.codeLine === 12 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;maxLength = Math.max(maxLength, windowEnd - windowStart + <span className="text-negative">1</span>);
                    </div>
                    <div>
                      &nbsp;&nbsp;&#125; <span className="text-accent">return</span> maxLength;
                    </div>
                    <div>
                      &#125;
                    </div>
                  </div>
                </div>
              </div>

              {/* Editor Footer */}
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
