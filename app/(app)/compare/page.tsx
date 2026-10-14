'use client';

import { Suspense, useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';
import { Card, PageContainer, PageHeader } from '@noirly-dev/ui';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import RendererFactory from '@/app/components/visualizer/renderers/RendererFactory';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import type { AlgorithmStep } from '@/src/core/engine/types';
import { bootstrapVisualizerEngine } from '@/app/lib/engineBootstrap';
import { COMPARE_GROUPS, countersAt, groupOf, type CompareGroup } from '@/app/lib/compare';
import { parseDraft, randomInput, toDraft, tryRun, worstCaseInput, type InputDraft, type LessonInput } from '@/app/lib/lessonInput';

const SPEED_MS = 700;

function Side({ name, steps, index }: { name: string; steps: AlgorithmStep[]; index: number }) {
  const step = steps[Math.min(index, steps.length - 1)];
  const counters = countersAt(steps, index);
  const done = index >= steps.length - 1;
  return (
    <Card className="flex min-w-0 flex-col gap-3 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="section-title">{name}</h2>
        <span className="meta">{done ? `finished in ${steps.length} steps` : `step ${index + 1} / ${steps.length}`}</span>
      </div>
      <div className="flex min-h-[260px] items-stretch overflow-x-auto rounded-[var(--r-md)] bg-bg p-3 shadow-[inset_0_0_0_1px_var(--hairline)]">
        {step ? <RendererFactory step={step} /> : null}
      </div>
      <p className="min-h-10 text-sm text-fg-2" aria-live="polite">
        {step?.description}
      </p>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          ['Steps', counters.steps],
          ['Comparisons', counters.comparisons],
          ['Writes', counters.writes],
        ].map(([label, value]) => (
          <div key={label} className="surface-flat p-2">
            <dt className="meta">{label}</dt>
            <dd className="matrix-numeral mt-1 text-xl text-fg">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function ComparePage() {
  const router = useRouter();
  const params = useSearchParams();
  const initialGroup = groupOf(params.get('a') ?? '') ?? COMPARE_GROUPS[0];
  const [group, setGroup] = useState<CompareGroup>(initialGroup);
  const [a, setA] = useState(params.get('a') && groupOf(params.get('a')!) === initialGroup ? params.get('a')! : initialGroup.pair[0]);
  const [b, setB] = useState(params.get('b') && groupOf(params.get('b')!) === initialGroup ? params.get('b')! : initialGroup.pair[1]);
  const [input, setInput] = useState<LessonInput>(initialGroup.example as LessonInput);
  const [draft, setDraft] = useState<InputDraft>(toDraft(initialGroup.example as LessonInput));
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => bootstrapVisualizerEngine(), []);

  const run = useCallback(
    (id: string) => {
      bootstrapVisualizerEngine();
      const algorithm = visualizerEngine.getAlgorithm(id);
      return (algorithm && tryRun(algorithm, input)) ?? [];
    },
    [input],
  );
  const stepsA = useMemo(() => run(a), [run, a]);
  const stepsB = useMemo(() => run(b), [run, b]);
  const last = Math.max(stepsA.length, stepsB.length) - 1;

  // Playback stops by itself at the last step of the longer run.
  const isPlaying = playing && index < last;
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setTimeout(() => setIndex((i) => Math.min(last, i + 1)), SPEED_MS);
    return () => window.clearTimeout(timer);
  }, [isPlaying, index, last]);

  const nameOf = (id: string) => group.algorithms.find((x) => x.id === id)?.name ?? id;

  const selectGroup = (next: CompareGroup) => {
    setGroup(next);
    setA(next.pair[0]);
    setB(next.pair[1]);
    setInput(next.example as LessonInput);
    setDraft(toDraft(next.example as LessonInput));
    setIndex(0);
    setPlaying(false);
    setError(null);
    router.replace(`/compare?a=${next.pair[0]}&b=${next.pair[1]}`, { scroll: false });
  };

  const choose = (side: 'a' | 'b', id: string) => {
    if (side === 'a') setA(id);
    else setB(id);
    setIndex(0);
    setPlaying(false);
    router.replace(`/compare?a=${side === 'a' ? id : a}&b=${side === 'b' ? id : b}`, { scroll: false });
  };

  const apply = (next: LessonInput) => {
    setInput(next);
    setDraft(toDraft(next));
    setIndex(0);
    setPlaying(false);
    setError(null);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = parseDraft(draft, group.spec);
    if (!parsed.ok) setError(parsed.error);
    else if (Object.keys(parsed.input).length === 0) setError('Enter an input first.');
    else apply(parsed.input);
  };

  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Compare' }]} />
      <PageHeader
        eyebrow="Compare"
        title="Compare algorithms"
        lead="Run two algorithms on the same input and watch steps, comparisons and writes add up."
      />

      <div role="tablist" aria-label="What to compare" className="tab-list">
        {COMPARE_GROUPS.map((g) => (
          <button key={g.id} type="button" role="tab" aria-selected={g.id === group.id} onClick={() => selectGroup(g)} className="tab focusable">
            {g.title}
          </button>
        ))}
      </div>

      <Card className="p-4">
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-[1fr_1fr_2fr]" aria-label="Algorithms and input">
          {(['a', 'b'] as const).map((side) => (
            <div key={side}>
              <label htmlFor={`compare-${side}`} className="mb-1 block text-xs text-fg-2">
                {side === 'a' ? 'Left' : 'Right'}
              </label>
              <select
                id={`compare-${side}`}
                value={side === 'a' ? a : b}
                onChange={(e) => choose(side, e.target.value)}
                className="w-full rounded-[var(--r-md)] border border-line bg-bg px-3 py-2 text-sm text-fg"
              >
                {group.algorithms.map((alg) => (
                  <option key={alg.id} value={alg.id}>
                    {alg.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            {group.spec.fields.map((field) => (
              <div key={field} className={field === 'target' ? '' : 'sm:col-span-2'}>
                <label htmlFor={`compare-${field}`} className="mb-1 block text-xs text-fg-2">
                  {field === 'array' ? `Array${group.spec.sortedArray ? ' (sorted automatically)' : ''}` : field === 'target' ? 'Target' : 'Edges (u-v)'}
                </label>
                <input
                  id={`compare-${field}`}
                  value={draft[field] ?? ''}
                  onChange={(e) => setDraft({ ...draft, [field]: e.target.value })}
                  className="w-full rounded-[var(--r-md)] border border-line bg-bg px-3 py-2 font-mono text-sm text-fg"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:col-span-3">
            <button type="submit" className="btn btn-solid btn-sm">
              Use this input
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => apply(randomInput(group.spec))}>
              Random
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => apply(worstCaseInput(group.spec))}>
              Worst case
            </button>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>
        </form>
      </Card>

      <div className="surface flex flex-wrap items-center justify-center gap-3 rounded-[var(--r-lg)] p-3" role="group" aria-label="Playback controls">
        <button type="button" aria-label="Previous step" disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))} className="btn btn-ghost btn-icon btn-sm">
          <SkipBack size={15} aria-hidden />
        </button>
        <button
          type="button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={() => {
            if (isPlaying) {
              setPlaying(false);
              return;
            }
            if (index >= last) setIndex(0);
            setPlaying(true);
          }}
          className="btn btn-solid btn-icon"
        >
          {isPlaying ? <Pause size={16} aria-hidden /> : <Play size={16} aria-hidden />}
        </button>
        <button type="button" aria-label="Next step" disabled={index >= last} onClick={() => setIndex((i) => Math.min(last, i + 1))} className="btn btn-ghost btn-icon btn-sm">
          <SkipForward size={15} aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Reset"
          onClick={() => {
            setPlaying(false);
            setIndex(0);
          }}
          className="btn btn-ghost btn-icon btn-sm"
        >
          <RotateCcw size={15} aria-hidden />
        </button>
        <span className="meta">
          Step {index + 1} / {last + 1}
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Side name={nameOf(a)} steps={stepsA} index={index} />
        <Side name={nameOf(b)} steps={stepsB} index={index} />
      </div>
    </PageContainer>
  );
}

export default function ComparePageRoute() {
  return (
    <Suspense fallback={null}>
      <ComparePage />
    </Suspense>
  );
}
