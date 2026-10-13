'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, Link2 } from 'lucide-react';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { Algorithm, AlgorithmStep, VisualizerState } from '@/src/core/engine/types';
import { bootstrapVisualizerEngine } from '@/app/lib/engineBootstrap';
import { findLessonById } from '@/app/data/curriculum';
import { getLessonTheory } from '@/app/data/lessonTheory';
import { useSettings } from '@/app/contexts/SettingsContext';
import { useProgressStore, getLessonMeta } from '@/src/features/progress';
import type { CompleteLessonResult } from '@/src/features/progress';
import RendererFactory from './renderers/RendererFactory';
import ExecutionPanel from './ExecutionPanel';
import CodePanel from './CodePanel';
import VisualizerControls from './VisualizerControls';
import CompletionModal from './CompletionModal';
import LessonStepBar, { canAccessStep, type LessonStep } from './LessonStepBar';
import InputPanel from './InputPanel';
import { SPEEDS } from './VisualizerControls';
import {
  decodeInput,
  detectInputSpec,
  parseStepParam,
  shareUrl,
  tryRun,
  type LessonInput,
} from '@/app/lib/lessonInput';
import { useUIStore } from '@/src/stores/ui';
import LessonTheoryView from './LessonTheoryView';
import LessonQuizView from './LessonQuizView';

interface Props {
  lessonId: string;
}

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.tagName === 'SELECT' || Boolean(el?.isContentEditable);
}

export default function UniversalVisualizer({ lessonId }: Props) {
  const { animationSpeed } = useSettings();
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [state, setState] = useState<VisualizerState | null>(null);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [completionResult, setCompletionResult] = useState<CompleteLessonResult | null>(null);
  const [activeStep, setActiveStep] = useState<LessonStep>('theory');
  const [stepProgress, setStepProgress] = useState({ visualize: false, theory: false, quiz: false });
  const [isCompleting, setIsCompleting] = useState(false);
  const [customInput, setCustomInput] = useState<LessonInput | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const setCurrentLesson = useProgressStore((s) => s.setCurrentLesson);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const isLessonCompleted = useProgressStore((s) => s.isLessonCompleted);

  // Route by lesson id: several tracks reuse an algorithm, but each lesson has
  // its own difficulty, complexity notes, breadcrumb and progress entry.
  const lessonCtx = findLessonById(lessonId);
  const algorithmId = lessonCtx?.lesson.algorithmId ?? lessonId;
  const lessonName = lessonCtx?.lesson.name ?? algorithm?.name ?? lessonId;
  const alreadyCompleted = isLessonCompleted(lessonId);
  const atFinalStep = state ? state.currentStep >= state.totalSteps - 1 : false;

  const theory = useMemo(() => getLessonTheory(lessonId, algorithm, lessonName), [lessonId, algorithm, lessonName]);

  useEffect(() => {
    bootstrapVisualizerEngine();

    const algo = visualizerEngine.getAlgorithm(algorithmId);
    if (!algo) {
      setError(`Algorithm "${algorithmId}" is not registered.`);
      return;
    }

    setAlgorithm(algo);
    setError(null);

    // A shared link (?input=…&step=…) opens on exactly that state (spec F6).
    const params = new URLSearchParams(window.location.search);
    const shared = decodeInput(params.get('input'));
    const sharedInput = shared && tryRun(algo, shared) ? shared : null;
    try {
      visualizerEngine.execute(algorithmId, sharedInput ?? {});
      visualizerEngine.setSpeed(animationSpeed);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to execute algorithm');
      return;
    }
    setCustomInput(sharedInput);
    const sharedStep = parseStepParam(params.get('step'), visualizerEngine.getState().totalSteps);
    if (sharedStep !== null || sharedInput) {
      if (sharedStep !== null) visualizerEngine.goToStep(sharedStep);
      setStepProgress((prev) => ({ ...prev, theory: true }));
      setActiveStep('visualize');
    }

    const unsubscribe = visualizerEngine.subscribe((newState) => {
      setState(newState);
      setCurrentStep(visualizerEngine.getCurrentStep());
    });

    setState(visualizerEngine.getState());
    setCurrentStep(visualizerEngine.getCurrentStep());
    void setCurrentLesson(lessonId);

    return () => {
      unsubscribe();
      visualizerEngine.pause();
    };
  }, [algorithmId, lessonId, setCurrentLesson]);

  useEffect(() => {
    visualizerEngine.setSpeed(animationSpeed);
  }, [animationSpeed]);

  useEffect(() => {
    if (atFinalStep) {
      setStepProgress((prev) => ({ ...prev, visualize: true }));
    }
  }, [atFinalStep]);

  const inputSpec = useMemo(() => (algorithm ? detectInputSpec(algorithmId, algorithm) : null), [algorithmId, algorithm]);

  const runWith = useCallback(
    (input: LessonInput | null) => {
      if (!algorithm) return;
      if (input && !tryRun(algorithm, input)) {
        setInputError('This visualizer cannot run on that input. Try a smaller or different one.');
        return;
      }
      visualizerEngine.pause();
      visualizerEngine.execute(algorithmId, input ?? {});
      setCustomInput(input);
      setInputError(null);
      setShareStatus(null);
    },
    [algorithm, algorithmId],
  );

  const share = useCallback(async () => {
    const url = shareUrl(window.location.href, customInput, visualizerEngine.getState().currentStep);
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('Link copied — it opens this lesson at this step with this input.');
    } catch {
      setShareStatus(url);
    }
  }, [customInput]);

  // Keyboard controls (spec F4). Ignored while typing, with modifier keys,
  // or while the command palette or a dialog is open.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target) || useUIStore.getState().commandPaletteOpen) return;
      if (document.querySelector('[role="dialog"]')) return;
      const target = event.target as HTMLElement | null;
      const onControl = target?.closest('button, a, [role="tab"]');

      const tab = ({ '1': 'theory', '2': 'visualize', '3': 'quiz' } as const)[event.key as '1' | '2' | '3'];
      if (tab) {
        if (canAccessStep(tab, stepProgress)) setActiveStep(tab);
        return;
      }
      if (activeStep !== 'visualize') return;

      const engineState = visualizerEngine.getState();
      switch (event.key) {
        case ' ':
          if (onControl) return; // Space already activates the focused control.
          event.preventDefault();
          if (engineState.isPlaying) visualizerEngine.pause();
          else visualizerEngine.play();
          break;
        case 'ArrowLeft':
          if (target?.closest('[role="tab"]')) return;
          event.preventDefault();
          visualizerEngine.previousStep();
          break;
        case 'ArrowRight':
          if (target?.closest('[role="tab"]')) return;
          event.preventDefault();
          visualizerEngine.nextStep();
          break;
        case 'r':
        case 'R':
          visualizerEngine.reset();
          break;
        case '[':
        case ']': {
          const index = SPEEDS.indexOf(engineState.speed);
          const next = SPEEDS[Math.max(0, Math.min(SPEEDS.length - 1, (index < 0 ? 1 : index) + (event.key === ']' ? 1 : -1)))];
          visualizerEngine.setSpeed(next);
          break;
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeStep, stepProgress]);

  const lessonMeta = getLessonMeta(lessonId);
  const nextLesson = lessonMeta?.next ? getLessonMeta(lessonMeta.next) : null;
  const learnPathHref = lessonCtx
    ? `/learn-path?track=${lessonCtx.track.id}&level=${lessonCtx.level}&topic=${lessonCtx.topic.id}`
    : '/learn-path';

  useEffect(() => {
    if (alreadyCompleted) {
      setStepProgress({ visualize: true, theory: true, quiz: true });
    }
  }, [alreadyCompleted]);

  if (error) {
    return (
      <div role="alert" className="surface flex h-64 items-center justify-center rounded-[var(--r-lg)] p-6 text-destructive">
        {error}
      </div>
    );
  }

  if (!algorithm || !state || !currentStep) {
    return (
      <div className="flex h-64 items-center justify-center" role="status">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
        <span className="sr-only">Loading lesson</span>
      </div>
    );
  }

  const difficulty = lessonCtx?.lesson.difficulty ?? 'Easy';

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const result = await completeLesson(lessonId);
      if (result) {
        setCompletionResult(result);
        setShowModal(true);
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const handleQuizPass = () => {
    setStepProgress((prev) => ({ ...prev, quiz: true }));
  };

  const handleTheoryContinue = () => {
    setStepProgress((prev) => ({ ...prev, theory: true }));
    setActiveStep('visualize');
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow mb-2">{lessonCtx ? `${lessonCtx.topic.name} · ${lessonCtx.level}` : algorithm.category}</p>
          <h1 className="page-title">{lessonName}</h1>
          <p className="mt-2 max-w-[60ch] text-sm text-fg-2">{algorithm.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="pill" data-tone="accent">
            {algorithm.category}
          </span>
          <span className="pill">{difficulty}</span>
          <span className="chip" title="Time complexity">
            T {lessonCtx?.lesson.time ?? algorithm.complexity.time}
          </span>
          <span className="chip" title="Space complexity">
            S {lessonCtx?.lesson.space ?? algorithm.complexity.space}
          </span>
        </div>
      </header>

      <LessonStepBar
        active={activeStep}
        completed={stepProgress}
        onStepClick={setActiveStep}
      />

      {activeStep === 'visualize' && (
        <div id="lesson-panel-visualize" role="tabpanel" aria-labelledby="lesson-tab-visualize" className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[7fr_3fr]">
          <section className="flex min-w-0 flex-col gap-4">
            {inputSpec ? (
              <InputPanel
                key={customInput ? 'custom' : 'example'}
                spec={inputSpec}
                current={customInput}
                error={inputError}
                onRun={runWith}
                onShare={() => void share()}
                shareStatus={shareStatus}
              />
            ) : null}
            <div className="surface flex min-h-[360px] flex-1 items-stretch overflow-x-auto rounded-[var(--r-lg)] p-4 sm:min-h-[420px] sm:p-6">
              <RendererFactory step={currentStep} />
            </div>
            <VisualizerControls
              isPlaying={state.isPlaying}
              currentStep={state.currentStep}
              totalSteps={state.totalSteps}
              speed={state.speed}
              onPlay={() => visualizerEngine.play()}
              onPause={() => visualizerEngine.pause()}
              onNext={() => visualizerEngine.nextStep()}
              onPrevious={() => visualizerEngine.previousStep()}
              onReset={() => visualizerEngine.reset()}
              onSpeedChange={(s) => visualizerEngine.setSpeed(s)}
            />
            {atFinalStep && (
              <div className="flex flex-col gap-3 rounded-[var(--r-lg)] bg-accent-soft px-4 py-3 shadow-[inset_0_0_0_1px_var(--hairline)] sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-fg">
                  Visualization complete — take the quiz to finish this lesson.
                </p>
                <button type="button" onClick={() => setActiveStep('quiz')} className="btn btn-solid btn-sm w-full sm:w-auto">
                  Go to quiz <ArrowRight size={14} aria-hidden />
                </button>
              </div>
            )}
            {!atFinalStep && (
              <p className="text-center text-xs text-fg-2">
                Step through to the final step to unlock the quiz
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="meta hidden sm:block" id="visualizer-shortcuts">
                Space play/pause · ←/→ step · R reset · [ ] speed · 1/2/3 tabs · / search
              </p>
              {!inputSpec ? (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => void share()}>
                  <Link2 size={13} aria-hidden /> Share this step
                </button>
              ) : null}
            </div>
            {!inputSpec && shareStatus ? (
              <p role="status" className="text-xs text-fg-2">
                {shareStatus}
              </p>
            ) : null}
            <CodePanel algorithmId={algorithmId} algorithm={algorithm} step={currentStep} />
          </section>

          <aside aria-label="Execution details" className="surface min-h-[320px] rounded-[var(--r-lg)] p-4 lg:min-h-[420px]">
            <p className="mono-label mb-3">Execution details</p>
            <ExecutionPanel algorithm={algorithm} step={currentStep} />
          </aside>
        </div>
      )}

      {activeStep === 'theory' && (
        <div id="lesson-panel-theory" role="tabpanel" aria-labelledby="lesson-tab-theory" className="min-h-0 flex-1 overflow-auto">
          <LessonTheoryView
            theory={theory}
            lessonName={lessonName}
            theoryViewed={stepProgress.theory}
            onContinue={handleTheoryContinue}
          />
        </div>
      )}

      {activeStep === 'quiz' && (
        <div id="lesson-panel-quiz" role="tabpanel" aria-labelledby="lesson-tab-quiz" className="min-h-0 flex-1 overflow-auto">
          <LessonQuizView
            lessonId={lessonId}
            lessonName={lessonName}
            alreadyCompleted={alreadyCompleted}
            nextLesson={nextLesson}
            learnPathHref={learnPathHref}
            onPass={handleQuizPass}
            onComplete={handleComplete}
            isCompleting={isCompleting}
          />
        </div>
      )}

      <CompletionModal
        open={showModal}
        result={completionResult}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
