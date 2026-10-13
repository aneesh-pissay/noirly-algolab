'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { reverseArray } from '@/src/core/algorithms/two-pointers/reverseArray';
import { AlgorithmStep, VisualizerState } from '@/src/core/engine/types';
import { algorithmTheory } from '@/app/data/algorithmTheory';
import Link from 'next/link';
import { lessonHref } from '@/app/data/lessonRoutes';

import { Icon } from '@/src/components/Icon';
export default function ReverseArrayPage() {
  const pathname = usePathname();
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState<'visualization' | 'theory' | 'challenge'>('visualization');

  const isTraversalAlias = pathname === '/visual-lab/traversal';
  const topicLabel = isTraversalAlias ? 'Traversal' : 'Reverse Array';
  const codeFileLabel = isTraversalAlias ? 'traversal.js' : 'reverseArray.js';

  const theory = algorithmTheory['reverse-array'];

  useEffect(() => {
    // Register and execute algorithm
    visualizerEngine.registerAlgorithm('reverse-array', reverseArray);
    visualizerEngine.execute('reverse-array', {
      array: [5, 3, 8, 1, 9, 2, 7]
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
  const leftPointer = currentStep.visualizationData?.left ?? -1;
  const rightPointer = currentStep.visualizationData?.right ?? -1;
  const highlights = currentStep.highlights || [];
  const variables = currentStep.variables || {};
  const isPlaying = state.isPlaying;
  const progress = ((state.currentStep + 1) / state.totalSteps) * 100;

  return (
    <>

      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        <div className="p-4 pb-2">
          <Breadcrumbs
            items={[
              { label: 'Learning Path', href: '/learn-path' },
              { label: topicLabel },
            ]}
          />
        </div>

        {/* Tab Navigation */}
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto border-b border-line">
            <button
              onClick={() => setActiveTab('visualization')}
              className={`px-4 py-2.5 font-display text-sm transition-all border-b-2 ${
                activeTab === 'visualization'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-fg-2 hover:text-fg'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name="visibility" className="text-sm" />
                Visualization
              </span>
            </button>
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-4 py-2.5 font-display text-sm transition-all border-b-2 ${
                activeTab === 'theory'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-fg-2 hover:text-fg'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name="school" className="text-sm" />
                Theory
              </span>
            </button>
            <button
              onClick={() => setActiveTab('challenge')}
              className={`px-4 py-2.5 font-display text-sm transition-all border-b-2 ${
                activeTab === 'challenge'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-fg-2 hover:text-fg'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name="emoji_events" className="text-sm" />
                Challenge
              </span>
            </button>
          </div>
        </div>

        {/* Challenge View */}
        {activeTab === 'challenge' && (
          <div className="flex-1 overflow-y-auto p-4">
            {/* The graded quiz lives in the lesson, where answers are checked on the server. */}
            <div className="surface mx-auto max-w-xl space-y-4 rounded-[var(--r-lg)] p-6 text-center">
              <h2 className="section-title">Test yourself on {topicLabel}</h2>
              <p className="text-sm text-fg-2">
                The quiz is part of the Arrays lesson in the learning path. Sign in to take it and save your progress.
              </p>
              <Link href={lessonHref('array-reverse')} className="btn btn-solid">
                Open the lesson quiz
              </Link>
            </div>
          </div>
        )}

        {/* Theory View */}
        {activeTab === 'theory' && (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-[900px] mx-auto space-y-6">
              {/* Overview */}
              <div className="glass-panel rounded-xl p-6">
                <h2 className="font-display text-title-lg font-bold text-fg mb-3 flex items-center gap-2">
                  <Icon name="info" className="text-accent" />
                  Overview
                </h2>
                <p className="text-fg-2 leading-relaxed">{theory?.overview}</p>
              </div>

              {/* How It Works */}
              <div className="glass-panel rounded-xl p-6">
                <h2 className="font-display text-title-lg font-bold text-fg mb-4 flex items-center gap-2">
                  <Icon name="settings" className="text-accent" />
                  How It Works
                </h2>
                <ol className="space-y-3">
                  {theory?.howItWorks.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-fg-2">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Key Points */}
              <div className="glass-panel rounded-xl p-6">
                <h2 className="font-display text-title-lg font-bold text-fg mb-4 flex items-center gap-2">
                  <Icon name="lightbulb" className="text-accent" />
                  Key Points
                </h2>
                <ul className="space-y-2">
                  {theory?.keyPoints.map((point, index) => (
                    <li key={index} className="flex gap-3 items-start">
                      <Icon name="check_circle" className="text-negative text-sm mt-0.5" />
                      <span className="text-fg-2">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pros */}
                <div className="glass-panel rounded-xl p-6 border-l-4 border-l-positive">
                  <h2 className="font-display text-title-md font-bold text-fg mb-4 flex items-center gap-2">
                    <Icon name="thumb_up" className="text-positive" />
                    Advantages
                  </h2>
                  <ul className="space-y-2">
                    {theory?.pros.map((pro, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <span className="text-positive text-xl">+</span>
                        <span className="text-fg-2 text-sm">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="glass-panel rounded-xl p-6 border-l-4 border-l-destructive">
                  <h2 className="font-display text-title-md font-bold text-fg mb-4 flex items-center gap-2">
                    <Icon name="thumb_down" className="text-destructive" />
                    Disadvantages
                  </h2>
                  <ul className="space-y-2">
                    {theory?.cons.map((con, index) => (
                      <li key={index} className="flex gap-2 items-start">
                        <span className="text-destructive text-xl">-</span>
                        <span className="text-fg-2 text-sm">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Use Cases */}
              <div className="glass-panel rounded-xl p-6">
                <h2 className="font-display text-title-lg font-bold text-fg mb-4 flex items-center gap-2">
                  <Icon name="label" className="text-accent" />
                  Common Use Cases
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {theory?.useCases.map((useCase, index) => (
                    <div key={index} className="flex gap-3 items-center p-3 bg-bg rounded-lg border border-line">
                      <Icon name="arrow_right" className="text-negative" />
                      <span className="text-fg text-sm">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visualization View */}
        {activeTab === 'visualization' && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden p-4 gap-4 pt-2">
          {/* Left Panel (Visualization) */}
          <section className="flex-[1.5] flex flex-col gap-4 min-w-0">
            <div className="glass-panel rounded-xl p-6 flex flex-col flex-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-lg flex items-center gap-2">
                  <Icon name="visibility" className="text-accent" />
                  Array Visualization
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

              {/* Array Blocks Canvas */}
              <div className="flex-1 flex items-center justify-center gap-3 relative px-4 overflow-x-auto">
                <div className="flex gap-3 min-w-min mx-auto">
                  {arrayData.map((value: number, index: number) => {
                    const isHighlighted = highlights.includes(index);
                    const showLeft = leftPointer === index;
                    const showRight = rightPointer === index;

                    return (
                      <div
                        key={index}
                        className={`flex flex-col items-center gap-3 transition-all duration-500 ${
                          isHighlighted ? 'transform scale-110' : 'opacity-40'
                        }`}
                      >
                        <div
                          className={`w-16 h-20 rounded-xl flex items-center justify-center relative ${
                            isHighlighted
                              ? 'bg-accent/20 border-2 border-accent shadow-[0_0_20px_var(--accent-soft)]'
                              : 'bg-surface-2 border border-line'
                          }`}
                        >
                          <span
                            className={`font-display text-2xl font-bold ${
                              isHighlighted ? 'text-accent' : 'text-fg'
                            }`}
                          >
                            {value}
                          </span>
                          {/* Pointer left */}
                          {showLeft && (
                            <div 
                              className={`absolute -top-10 flex flex-col items-center ${
                                showLeft && showRight 
                                  ? 'left-1/4 -translate-x-1/2' 
                                  : 'left-1/2 -translate-x-1/2'
                              }`}
                            >
                              <span className="font-mono text-accent text-sm font-bold mb-1">left</span>
                              <Icon name="arrow_drop_down" className="text-accent text-2xl" />
                            </div>
                          )}
                          {/* Pointer right */}
                          {showRight && (
                            <div 
                              className={`absolute -top-10 flex flex-col items-center ${
                                showLeft && showRight 
                                  ? 'left-3/4 -translate-x-1/2' 
                                  : 'left-1/2 -translate-x-1/2'
                              }`}
                            >
                              <span className="font-mono text-negative text-sm font-bold mb-1">right</span>
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
                      Left Pointer
                    </span>
                    <span className="font-mono text-accent">{variables.left ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Right Pointer
                    </span>
                    <span className="font-mono text-accent">{variables.right ?? '-'}</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line col-span-2">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Swaps
                    </span>
                    <span className="font-mono text-negative">
                      {variables.swaps ?? 0}
                    </span>
                  </div>
                </div>
                <div className="space-y-2 mt-4 pt-4 border-t border-line">
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">Array Length</span>
                    <span className="text-fg font-mono">{arrayData.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">Current State</span>
                    <span className="text-fg font-mono text-xs">
                      [{arrayData.join(', ')}]
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
                  {codeFileLabel}
                </button>
              </div>

              {/* Code Content */}
              <div className="flex-1 font-mono text-[13px] leading-6 p-4 overflow-auto bg-bg/30">
                <div className="flex gap-4">
                  <div className="text-fg-3 text-right select-none pr-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lineNum) => (
                      <div key={lineNum}>{lineNum}</div>
                    ))}
                  </div>
                  <div className="flex-1">
                    {/* Line 1 */}
                    <div className={currentStep.codeLine === 1 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      <span className="text-accent">function</span>{' '}
                      <span className="text-negative">reverseArray</span>(arr) &#123;
                    </div>
                    {/* Line 2 */}
                    <div className={currentStep.codeLine === 2 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;<span className="text-accent">let</span> left = <span className="text-negative">0</span>;
                    </div>
                    {/* Line 3 */}
                    <div className={currentStep.codeLine === 3 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;<span className="text-accent">let</span> right = arr.length - <span className="text-negative">1</span>;
                    </div>
                    {/* Line 4 */}
                    <div>
                      &nbsp;&nbsp;<span className="text-accent">while</span> (left &lt; right) &#123;
                    </div>
                    {/* Line 5 */}
                    <div className={currentStep.codeLine === 5 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">let</span> temp = arr[left];
                    </div>
                    {/* Line 6 */}
                    <div className={currentStep.codeLine === 6 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;arr[left] = arr[right];
                    </div>
                    {/* Line 7 */}
                    <div className={currentStep.codeLine === 7 ? 'bg-accent/10 -mx-4 px-4 border-l-2 border-accent' : ''}>
                      &nbsp;&nbsp;&nbsp;&nbsp;arr[right] = temp;
                    </div>
                    {/* Line 8 */}
                    <div>
                      &nbsp;&nbsp;&nbsp;&nbsp;left++; right--;
                    </div>
                    {/* Line 9 */}
                    <div>
                      &nbsp;&nbsp;&#125; <span className="text-accent">return</span> arr;
                    </div>
                    {/* Line 10 */}
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
        )}
      </div>
    </>
  );
}
