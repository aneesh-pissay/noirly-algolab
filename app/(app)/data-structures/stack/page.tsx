'use client';

import Breadcrumbs from '@/app/components/Breadcrumbs';

import { Icon } from '@/src/components/Icon';
export default function StackPage() {
  return (
    <>

      <div className="min-h-0 flex-1 overflow-hidden flex flex-col">
        <div className="p-4">
          <Breadcrumbs
            items={[
              { label: 'Dashboard', href: '/' },
              { label: 'Data Structures', href: '/data-structures' },
              { label: 'Stack' },
            ]}
          />
        </div>

        {/* Three Column Layout */}
        <div className="flex-1 flex overflow-hidden p-4 gap-4 pt-0">
          {/* Left Panel (Visualization) */}
          <section className="flex-[1.5] flex flex-col gap-4 min-w-0">
            <div className="glass-panel rounded-xl p-6 flex flex-col flex-1 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-lg flex items-center gap-2">
                  <Icon name="stacks" className="text-accent" />
                  Stack Visualization
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-fg-2 text-sm font-mono">LIFO (Last In First Out)</span>
                </div>
              </div>

              {/* Stack Visualization */}
              <div className="flex-1 flex flex-col items-center justify-center relative">
                {/* Stack Container */}
                <div className="relative flex flex-col-reverse items-center gap-3 min-h-[400px] justify-end">
                  {/* Base */}
                  <div className="w-64 h-2 bg-line-strong rounded-full"></div>

                  {/* Stack Elements */}
                  <div className="w-64 h-16 glass-panel rounded-lg flex items-center justify-between px-6 transform hover:scale-105 transition-transform">
                    <span className="font-display text-2xl text-accent">42</span>
                    <span className="font-mono text-sm text-fg-2">index [2]</span>
                    <div className="absolute -right-16 flex items-center gap-2">
                      <Icon name="arrow_back" className="text-accent animate-pulse" />
                      <span className="font-mono text-xs text-accent uppercase">Top</span>
                    </div>
                  </div>

                  <div className="w-64 h-16 glass-panel rounded-lg flex items-center justify-between px-6 opacity-80">
                    <span className="font-display text-2xl text-fg">17</span>
                    <span className="font-mono text-sm text-fg-2">index [1]</span>
                  </div>

                  <div className="w-64 h-16 glass-panel rounded-lg flex items-center justify-between px-6 opacity-60">
                    <span className="font-display text-2xl text-fg">8</span>
                    <span className="font-mono text-sm text-fg-2">index [0]</span>
                  </div>

                  {/* Top Pointer Arrow */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <Icon name="arrow_drop_down" className="text-accent text-4xl animate-bounce" />
                  </div>
                </div>

                {/* Size Indicator */}
                <div className="absolute bottom-8 right-8 glass-panel px-4 py-2 rounded-lg">
                  <div className="text-fg-2 text-xs font-mono uppercase mb-1">Stack Size</div>
                  <div className="font-display text-2xl text-accent">3</div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-auto pt-6 border-t border-line">
                <div className="flex items-center justify-center gap-4">
                  <button className="px-6 py-3 bg-accent text-accent-ink rounded-lg font-display font-semibold hover:brightness-110 transition-all flex items-center gap-2">
                    <Icon name="add" />
                    Push
                  </button>
                  <button className="px-6 py-3 bg-destructive text-bg rounded-lg font-display font-semibold hover:brightness-110 transition-all flex items-center gap-2">
                    <Icon name="remove" />
                    Pop
                  </button>
                  <button className="px-6 py-3 bg-surface-2 text-fg rounded-lg font-display font-semibold hover:bg-fg/5 transition-all flex items-center gap-2">
                    <Icon name="visibility" />
                    Peek
                  </button>
                  <button className="px-6 py-3 bg-surface-2 text-fg rounded-lg font-display font-semibold hover:bg-fg/5 transition-all flex items-center gap-2">
                    <Icon name="restart_alt" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Center Panel (Properties & Operations) */}
          <section className="flex-1 flex flex-col gap-4 min-w-[320px]">
            {/* Current Operation */}
            <div className="glass-panel rounded-xl p-5 border-l-4 border-l-accent">
              <h3 className="font-display text-lg mb-2 flex items-center gap-2">
                <Icon name="info" className="text-sm" />
                Current State
              </h3>
              <p className="font-sans text-fg-2 leading-relaxed">
                The stack currently has <span className="text-accent font-bold">3 elements</span>. The top element is{' '}
                <code className="text-accent font-bold">42</code>. Next operation will access or modify the top
                element only.
              </p>
            </div>

            {/* Stack Properties */}
            <div className="glass-panel rounded-xl p-5 flex-1">
              <h3 className="font-mono uppercase tracking-tighter text-fg-2 mb-4 flex items-center gap-2">
                <Icon name="rule" className="text-sm" />
                Stack Properties
              </h3>
              <div className="space-y-4">
                <div className="bg-bg p-4 rounded-lg border border-line">
                  <h4 className="text-sm font-bold text-fg mb-2">LIFO Principle</h4>
                  <p className="text-xs text-fg-2 leading-relaxed">
                    Last element added is the first to be removed. Only the top element is accessible.
                  </p>
                </div>
                <div className="bg-bg p-4 rounded-lg border border-line">
                  <h4 className="text-sm font-bold text-fg mb-2">Main Operations</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs">
                      <Icon name="arrow_upward" className="text-accent text-sm" />
                      <div>
                        <span className="text-fg font-semibold">Push:</span>
                        <span className="text-fg-2"> Add element to top</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 text-xs">
                      <Icon name="arrow_downward" className="text-destructive text-sm" />
                      <div>
                        <span className="text-fg font-semibold">Pop:</span>
                        <span className="text-fg-2"> Remove top element</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 text-xs">
                      <Icon name="visibility" className="text-negative text-sm" />
                      <div>
                        <span className="text-fg font-semibold">Peek:</span>
                        <span className="text-fg-2"> View top without removing</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Complexity Card */}
            <div className="bg-surface-2/40 rounded-xl p-5 border border-line">
              <h4 className="font-mono text-xs text-accent uppercase mb-3 tracking-widest flex items-center gap-2">
                <Icon name="speed" className="text-sm" />
                Time Complexity
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fg-2">Push</span>
                  <span className="font-mono text-accent">O(1)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fg-2">Pop</span>
                  <span className="font-mono text-accent">O(1)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-fg-2">Peek</span>
                  <span className="font-mono text-accent">O(1)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-line">
                  <span className="text-sm text-fg-2">Space</span>
                  <span className="font-mono text-accent">O(n)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Panel (Code Implementation) */}
          <section className="flex-1 flex flex-col min-w-[380px]">
            <div className="glass-panel rounded-xl flex-1 flex flex-col overflow-hidden">
              {/* Editor Tabs */}
              <div className="flex bg-bg/80 border-b border-line">
                <button className="px-4 py-2.5 border-b-2 border-accent bg-surface-2 text-fg text-xs font-mono flex items-center gap-2">
                  <span className="w-3 h-3 bg-negative rounded-sm"></span>
                  Stack.js
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
                    <br />
                    13
                    <br />
                    14
                    <br />
                    15
                    <br />
                    16
                    <br />
                    17
                    <br />
                    18
                    <br />
                    19
                    <br />
                    20
                  </div>
                  <div className="flex-1">
                    <span className="text-accent">class</span>{' '}
                    <span className="text-negative">Stack</span> &#123;
                    <br />
                    &nbsp;&nbsp;<span className="text-accent">constructor</span>() &#123;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">this</span>.items = [];
                    <br />
                    &nbsp;&nbsp;&#125;
                    <br />
                    <br />
                    &nbsp;&nbsp;<span className="text-negative">push</span>(element) &#123;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">this</span>.items.
                    <span className="text-negative">push</span>(element);
                    <br />
                    &nbsp;&nbsp;&#125;
                    <br />
                    <br />
                    &nbsp;&nbsp;<span className="text-negative">pop</span>() &#123;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">if</span> (
                    <span className="text-accent">this</span>.
                    <span className="text-negative">isEmpty</span>())
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">return</span>{' '}
                    <span className="text-accent">null</span>;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">return</span>{' '}
                    <span className="text-accent">this</span>.items.
                    <span className="text-negative">pop</span>();
                    <br />
                    &nbsp;&nbsp;&#125;
                    <br />
                    <br />
                    &nbsp;&nbsp;<span className="text-negative">peek</span>() &#123;
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-accent">return</span>{' '}
                    <span className="text-accent">this</span>.items[
                    <span className="text-accent">this</span>.items.length -{' '}
                    <span className="text-negative">1</span>];
                    <br />
                    &nbsp;&nbsp;&#125;
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
                  <span>20 lines</span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent"></span> Ready
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Section (Use Cases) */}
        <footer className="h-28 px-4 pb-4">
          <div className="glass-panel h-full rounded-xl p-4">
            <h3 className="font-mono text-xs text-fg-2 uppercase tracking-widest mb-3">
              Real-World Use Cases
            </h3>
            <div className="flex gap-4 overflow-x-auto">
              <div className="flex items-center gap-3 bg-surface-2 px-4 py-2 rounded-lg min-w-fit">
                <Icon name="undo" className="text-accent text-sm" />
                <div>
                  <div className="text-sm font-semibold text-fg">Undo/Redo</div>
                  <div className="text-xs text-fg-2">Text editors, browsers</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface-2 px-4 py-2 rounded-lg min-w-fit">
                <Icon name="history" className="text-accent text-sm" />
                <div>
                  <div className="text-sm font-semibold text-fg">Browser History</div>
                  <div className="text-xs text-fg-2">Back/Forward navigation</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface-2 px-4 py-2 rounded-lg min-w-fit">
                <Icon name="functions" className="text-accent text-sm" />
                <div>
                  <div className="text-sm font-semibold text-fg">Function Calls</div>
                  <div className="text-xs text-fg-2">Call stack in programming</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-surface-2 px-4 py-2 rounded-lg min-w-fit">
                <Icon name="calculate" className="text-accent text-sm" />
                <div>
                  <div className="text-sm font-semibold text-fg">Expression Evaluation</div>
                  <div className="text-xs text-fg-2">Parsing & calculating expressions</div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
