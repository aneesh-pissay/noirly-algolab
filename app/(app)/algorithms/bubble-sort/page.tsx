'use client';

import Breadcrumbs from '@/app/components/Breadcrumbs';

import { Icon } from '@/src/components/Icon';
export default function BubbleSortPage() {
  return (
    <>

      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        <div className="p-4">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Algorithms', href: '/algorithms' },
              { label: 'Bubble Sort' },
            ]}
          />
        </div>

        {/* Three Column Split Layout */}
        <div className="flex-1 flex overflow-hidden p-4 gap-4 pt-0">
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
              <div className="flex-1 flex items-center justify-center gap-6 relative">
                {/* Node 0 */}
                <div className="flex flex-col items-center gap-4 transition-all duration-500 transform scale-110">
                  <div className="w-20 h-24 bg-accent/20 border-2 border-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--accent-soft)] relative">
                    <span className="font-display text-3xl text-accent">5</span>
                    <div className="absolute -top-12 animate-bounce">
                      <Icon name="arrow_drop_down" className="text-accent text-3xl" />
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-accent text-xs">
                        i
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-fg-2">index [0]</span>
                </div>

                {/* Node 1 */}
                <div className="flex flex-col items-center gap-4 transition-all duration-500 transform scale-110">
                  <div className="w-20 h-24 bg-accent/20 border-2 border-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--accent-soft)] relative">
                    <span className="font-display text-3xl text-accent">3</span>
                    <div className="absolute -top-12 animate-bounce">
                      <Icon name="arrow_drop_down" className="text-accent text-3xl" />
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-mono text-accent text-xs">
                        j
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-xs text-fg-2">index [1]</span>
                </div>

                {/* Node 2 */}
                <div className="flex flex-col items-center gap-4 opacity-40">
                  <div className="w-20 h-24 bg-surface-2 border border-line rounded-xl flex items-center justify-center">
                    <span className="font-display text-3xl text-fg">8</span>
                  </div>
                  <span className="font-mono text-xs text-fg-2">index [2]</span>
                </div>

                {/* Node 3 */}
                <div className="flex flex-col items-center gap-4 opacity-40">
                  <div className="w-20 h-24 bg-surface-2 border border-line rounded-xl flex items-center justify-center">
                    <span className="font-display text-3xl text-fg">1</span>
                  </div>
                  <span className="font-mono text-xs text-fg-2">index [3]</span>
                </div>

                {/* Node 4 */}
                <div className="flex flex-col items-center gap-4 opacity-40">
                  <div className="w-20 h-24 bg-surface-2 border border-line rounded-xl flex items-center justify-center">
                    <span className="font-display text-3xl text-fg">9</span>
                  </div>
                  <span className="font-mono text-xs text-fg-2">index [4]</span>
                </div>
              </div>

              {/* Controls Footer */}
              <div className="mt-auto pt-6 border-t border-line flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-line hover:bg-fg/5 transition-colors">
                    <Icon name="skip_previous" />
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-lg bg-accent text-accent-ink hover:brightness-110 transition-all shadow-lg shadow-accent/20">
                    <Icon name="pause" />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-line hover:bg-fg/5 transition-colors">
                    <Icon name="skip_next" />
                  </button>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-xs text-fg-2 uppercase tracking-widest mb-1">
                    Step 4 / 20
                  </span>
                  <div className="w-48 h-1.5 bg-fg/10 rounded-full overflow-hidden">
                    <div className="w-1/5 h-full bg-accent rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Center Panel (Logic/Memory) */}
          <section className="flex-1 flex flex-col gap-4 min-w-[320px]">
            {/* Operation Status */}
            <div className="glass-panel rounded-xl p-5 border-l-4 border-l-accent">
              <h3 className="font-display text-lg mb-2">Comparing Elements</h3>
              <p className="font-sans text-fg-2 leading-relaxed">
                Checking if <code className="text-accent font-bold">arr[0] &gt; arr[1]</code>. Since{' '}
                <span className="text-accent">5 &gt; 3</span> is <span className="text-negative">true</span>, a swap
                will be performed in the next step to push the larger element right.
              </p>
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
                      Variable i
                    </span>
                    <span className="font-mono text-accent">0</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Variable j
                    </span>
                    <span className="font-mono text-accent">1</span>
                  </div>
                  <div className="bg-bg p-3 rounded-lg border border-line col-span-2">
                    <span className="text-[10px] font-mono text-fg-2 uppercase block mb-1">
                      Temp (Swap)
                    </span>
                    <span className="font-mono text-negative">null</span>
                  </div>
                </div>
                <div className="space-y-2 mt-4 pt-4 border-t border-line">
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">Array Length</span>
                    <span className="text-fg font-mono">5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">Swaps Performed</span>
                    <span className="text-fg font-mono">2</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-2 font-sans">Current State</span>
                    <span className="text-fg font-mono">[5, 3, 8, 1, 9]</span>
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
                  <span className="font-mono text-lg">O(n²)</span>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-fg-2 uppercase block">Space</span>
                  <span className="font-mono text-lg">O(1)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel (Code Editor) */}
          <section className="flex-1 flex flex-col min-w-[380px]">
            <div className="glass-panel rounded-xl flex-1 flex flex-col overflow-hidden">
              {/* Editor Tabs */}
              <div className="flex bg-bg/80 border-b border-line">
                <button className="px-4 py-2.5 border-b-2 border-accent bg-surface-2 text-fg text-xs font-mono flex items-center gap-2">
                  <span className="w-3 h-3 bg-negative rounded-sm"></span>
                  BubbleSort.js
                </button>
                <button className="px-4 py-2.5 text-fg-2 text-xs font-mono hover:bg-fg/5 flex items-center gap-2 transition-colors">
                  Python
                </button>
                <button className="px-4 py-2.5 text-fg-2 text-xs font-mono hover:bg-fg/5 flex items-center gap-2 transition-colors">
                  Java
                </button>
              </div>

              {/* Code Content */}
              <div className="flex-1 font-mono text-[13px] leading-6 p-4 overflow-auto bg-bg/30">
                <div className="flex gap-4">
                  <div className="text-fg-3 text-right select-none pr-2">
                    1<br />
                    2<br />
                    3<br />
                    4<br />
                    5<br />
                    6<br />
                    7<br />
                    8<br />
                    9<br />
                    10
                    <br />
                    11
                    <br />
                    12
                  </div>
                  <div className="flex-1">
                    <span className="text-accent">function</span>{' '}
                    <span className="text-negative">bubbleSort</span>(arr) &#123;
                    <br />
                    &nbsp;&nbsp;<span className="text-accent">let</span> n = arr.length;
                    <br />
                    &nbsp;&nbsp;<span className="text-accent">for</span> (
                    <span className="text-accent">let</span> i = <span className="text-negative">0</span>; i
                    &lt; n; i++) &#123;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">for</span> (
                    <span className="text-accent">let</span> j = <span className="text-negative">0</span>; j
                    &lt; n - i - <span className="text-negative">1</span>; j++) &#123;
                    <br />
                    <div className="bg-accent/10 -mx-4 px-4 border-l-2 border-accent">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">if</span> (arr[j]
                      &gt; arr[j + <span className="text-negative">1</span>]) &#123;
                    </div>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">let</span>{' '}
                    temp = arr[j];
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arr[j] = arr[j +{' '}
                    <span className="text-negative">1</span>];
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arr[j + <span className="text-negative">1</span>] =
                    temp;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&#125;
                    <br />
                    &nbsp;&nbsp;&#125;
                    <br />
                    &nbsp;&nbsp;<span className="text-accent">return</span> arr;
                    <br />
                    &#125;
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
                  <span>Ln 5, Col 12</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent"></span> Prettier
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Section (Execution Timeline) */}
        <footer className="h-28 px-4 pb-4">
          <div className="glass-panel h-full rounded-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-mono text-xs text-fg-2 uppercase tracking-widest">
                Execution Timeline
              </h3>
              <div className="flex gap-6 text-[10px] font-mono uppercase text-fg-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim"></span> Completed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span> Active
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-line-strong"></span> Pending
                </span>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-between gap-1 relative px-8">
              {/* Line */}
              <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-line-strong z-0"></div>
              {/* Steps */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary-fixed-dim border-4 border-bg"></div>
                <span className="text-[10px] font-sans text-fg-2">Initialize</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary-fixed-dim border-4 border-bg"></div>
                <span className="text-[10px] font-sans text-fg-2">Outer Loop</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary-fixed-dim border-4 border-bg"></div>
                <span className="text-[10px] font-sans text-fg-2">Inner Loop</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-accent border-4 border-bg ring-4 ring-accent/20"></div>
                <span className="text-[10px] font-sans text-accent font-bold">Compare</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-line-strong border-4 border-bg"></div>
                <span className="text-[10px] font-sans text-fg-3">Swap</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-line-strong border-4 border-bg"></div>
                <span className="text-[10px] font-sans text-fg-3">Inc. Pointer</span>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2 opacity-50">
                <div className="w-4 h-4 rounded-full bg-line-strong border-4 border-bg"></div>
                <span className="text-[10px] font-sans text-fg-3">Complete</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
