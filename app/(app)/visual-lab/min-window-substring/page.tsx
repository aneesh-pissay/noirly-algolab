'use client';

import { useEffect, useState } from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { minWindowSubstring } from '@/src/core/algorithms/sliding-window/minWindowSubstring';
import { AlgorithmStep, VisualizerState } from '@/src/core/engine/types';

import { Icon } from '@/src/components/Icon';
export default function MinWindowSubstringPage() {
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Register and execute algorithm
    visualizerEngine.registerAlgorithm('min-window-substring', minWindowSubstring);
    visualizerEngine.execute('min-window-substring', {
      str: 'ADOBECODEBANC',
      pattern: 'ABC'
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

  const stringData = currentStep.visualizationData?.string || '';
  const pattern = currentStep.visualizationData?.pattern || '';
  const windowStart = currentStep.visualizationData?.windowStart ?? -1;
  const windowEnd = currentStep.visualizationData?.windowEnd ?? -1;
  const patternCount = currentStep.visualizationData?.patternCount || {};
  const windowCount = currentStep.visualizationData?.windowCount || {};
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
              { label: 'Minimum Window Substring' },
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

              {/* Pattern Display */}
              <div className="mb-6 p-4 bg-surface-2 rounded-lg border border-line">
                <div className="text-xs text-fg-2 uppercase mb-2">Target Pattern</div>
                <div className="font-mono text-2xl text-accent tracking-widest">{pattern}</div>
              </div>

              {/* String Characters Canvas */}
              <div className="flex-1 flex items-center justify-center gap-2 relative flex-wrap">
                {stringData.split('').map((char: string, index: number) => {
                  const isHighlighted = highlights.includes(index);
                  const isInWindow = index >= windowStart && index <= windowEnd && windowStart !== -1;
                  const isWindowBoundary = index === windowStart || index === windowEnd;

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center gap-2 transition-all duration-500 ${
                        isHighlighted ? 'transform scale-110' : isInWindow ? '' : 'opacity-40'
                      }`}
                    >
                      <div
                        className={`w-14 h-16 rounded-lg flex items-center justify-center relative ${
                          isHighlighted
                            ? 'bg-accent/20 border-2 border-accent shadow-[0_0_20px_var(--accent-soft)]'
                            : isInWindow
                            ? 'bg-tertiary-container/30 border border-negative'
                            : 'bg-surface-2 border border-line'
                        }`}
                      >
                        <span
                          className={`font-mono text-xl ${
                            isHighlighted ? 'text-accent' : isInWindow ? 'text-fg' : 'text-fg-2'
                          }`}
                        >
                          {char}
                        </span>
                        {/* Window Start Marker */}
                        {index === windowStart && (
                          <div className="absolute -top-8 flex flex-col items-center">
                            <span className="font-mono text-accent text-xs font-bold mb-1">start</span>
                            <Icon name="arrow_drop_down" className="text-accent text-lg" />
                          </div>
                        )}
                        {/* Window End Marker */}
                        {index === windowEnd && (
                          <div className="absolute -bottom-8 flex flex-col items-center">
                            <Icon name="arrow_drop_up" className="text-negative text-lg" />
                            <span className="font-mono text-negative text-xs font-bold mt-1">end</span>
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-fg-2">
                        [{index}]
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Character Count Maps */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-3 bg-bg rounded-lg border border-line">
                  <div className="text-[10px] text-fg-2 uppercase mb-2">Pattern Count</div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(patternCount).map(([char, count]) => (
                      <span key={char} className="font-mono text-xs text-accent">
                        {char}:{count as number}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-bg rounded-lg border border-line">
                  <div className="text-[10px] text-fg-2 uppercase mb-2">Window Count</div>
                  <div className="flex gap-2 flex-wrap">
                    {Object.entries(windowCount).map(([char, count]) => (
                      <span key={char} className="font-mono text-xs text-negative">
                        {char}:{count as number}
                      </span>
                    ))}
                  </div>
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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Pattern Length
                    </span>
                    <span className="font-mono text-accent">{variables.patternLength ?? '-'}</span>
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
                    <span className="font-mono text-accent">{variables.windowEnd ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Matched
                    </span>
                    <span className="font-mono text-negative">{variables.matched ?? 0}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Required Matches
                    </span>
                    <span className="font-mono text-negative">{variables.requiredMatches ?? 0}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Min Length
                    </span>
                    <span className="font-mono text-negative">{variables.minLength ?? '∞'}</span>
                  </div>
                </div>
                <div className="space-y-2 mt-4 pt-4 border-t border-line">
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">String Length</span>
                    <span className="text-fg font-mono">{stringData.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">Current Window</span>
                    <span className="text-fg font-mono text-xs">
                      {windowStart !== -1 && windowEnd !== -1 ? stringData.slice(windowStart, windowEnd + 1) : '-'}
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
                  <span className="font-mono text-lg">{currentStep.complexity?.time || 'O(n+m)'}</span>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-fg-2 uppercase block">Space</span>
                  <span className="font-mono text-lg">{currentStep.complexity?.space || 'O(m)'}</span>
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
                  minWindowSubstring.js
                </button>
              </div>

              {/* Code Content */}
              <div className="flex-1 font-mono text-[13px] leading-6 p-4 overflow-auto bg-bg/30">
                <div className="flex gap-4">
                  <div className="text-fg-3 text-right select-none pr-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((lineNum) => (
                      <div key={lineNum}>{lineNum}</div>
                    ))}
                  </div>
                  <div className="flex-1">
                    {/* Line 1 */}
                    <div className={currentStep.codeLine === 1 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      <span className="text-accent">function</span>{' '}
                      <span className="text-negative">minWindowSubstring</span>(str, pattern) &#123;
                    </div>
                    {/* Line 2 */}
                    <div className={currentStep.codeLine === 2 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;<span className="text-accent">let</span> patternCount = &#123;&#125;;
                    </div>
                    {/* Line 3 */}
                    <div className={currentStep.codeLine === 3 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;<span className="text-accent">let</span> windowCount = &#123;&#125;;
                    </div>
                    {/* Line 4 */}
                    <div className={currentStep.codeLine === 4 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;<span className="text-accent">let</span> matched = <span className="text-negative">0</span>;
                    </div>
                    {/* Line 5 */}
                    <div className={currentStep.codeLine === 5 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;<span className="text-accent">let</span> minLength = Infinity;
                    </div>
                    {/* Line 6 */}
                    <div className={currentStep.codeLine === 6 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;<span className="text-accent">let</span> start = <span className="text-negative">0</span>, end = <span className="text-negative">0</span>;
                    </div>
                    {/* Line 7 */}
                    <div>
                      &nbsp;&nbsp;<span className="text-accent">while</span> (end &lt; str.length) &#123;
                    </div>
                    {/* Line 8 */}
                    <div className={currentStep.codeLine === 8 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;windowCount[str[end]] = (windowCount[str[end]] || <span className="text-negative">0</span>) + <span className="text-negative">1</span>;
                    </div>
                    {/* Line 9 */}
                    <div className={currentStep.codeLine === 9 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">if</span> (windowCount[str[end]] === patternCount[str[end]]) matched++;
                    </div>
                    {/* Line 10 */}
                    <div className={currentStep.codeLine === 10 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">while</span> (matched === Object.keys(patternCount).length) &#123;
                    </div>
                    {/* Line 11 */}
                    <div className={currentStep.codeLine === 11 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;minLength = Math.min(minLength, end - start + <span className="text-negative">1</span>);
                    </div>
                    {/* Line 12 */}
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;&#125; end++;
                    </div>
                    {/* Line 13 */}
                    <div>
                      &nbsp;&nbsp;&#125; <span className="text-accent">return</span> minLength;
                    </div>
                    {/* Line 14 */}
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
