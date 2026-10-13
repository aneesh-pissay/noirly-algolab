'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import { Algorithm, AlgorithmStep, VisualizerState } from '@/src/core/engine/types';
import { bootstrapVisualizerEngine } from '@/app/lib/engineBootstrap';
import { findLessonByAlgorithmId } from '@/app/data/curriculum';
import { getLessonTheory, getLessonQuiz } from '@/app/data/lessonContent';
import { useSettings } from '@/app/contexts/SettingsContext';
import { useProgressStore, getLessonByAlgorithmId, getLessonMeta } from '@/src/features/progress';
import type { CompleteLessonResult } from '@/src/features/progress';
import RendererFactory from './renderers/RendererFactory';
import ExecutionPanel from './ExecutionPanel';
import CodePanel from './CodePanel';
import VisualizerControls from './VisualizerControls';
import CompletionModal from './CompletionModal';
import LessonStepBar, { type LessonStep } from './LessonStepBar';
import LessonTheoryView from './LessonTheoryView';
import LessonQuizView from './LessonQuizView';

interface Props {
  algorithmId: string;
}

export default function UniversalVisualizer({ algorithmId }: Props) {
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

  const setCurrentLessonByAlgorithm = useProgressStore((s) => s.setCurrentLessonByAlgorithm);
  const completeLesson = useProgressStore((s) => s.completeLesson);
  const isLessonCompleted = useProgressStore((s) => s.isLessonCompleted);

  const lessonCtx = findLessonByAlgorithmId(algorithmId);
  const lessonId = lessonCtx?.lesson.id;
  const lessonName = lessonCtx?.lesson.name ?? algorithm?.name ?? algorithmId;
  const alreadyCompleted = lessonId ? isLessonCompleted(lessonId) : false;
  const atFinalStep = state ? state.currentStep >= state.totalSteps - 1 : false;

  const theory = useMemo(
    () => getLessonTheory(algorithmId, algorithm, lessonName),
    [algorithmId, algorithm, lessonName]
  );
  const quizQuestions = useMemo(
    () => getLessonQuiz(algorithmId, algorithm, lessonName),
    [algorithmId, algorithm, lessonName]
  );

  useEffect(() => {
    bootstrapVisualizerEngine();

    const algo = visualizerEngine.getAlgorithm(algorithmId);
    if (!algo) {
      setError(`Algorithm "${algorithmId}" is not registered.`);
      return;
    }

    setAlgorithm(algo);
    setError(null);

    try {
      visualizerEngine.execute(algorithmId, {});
      visualizerEngine.setSpeed(animationSpeed);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to execute algorithm');
      return;
    }

    const unsubscribe = visualizerEngine.subscribe((newState) => {
      setState(newState);
      setCurrentStep(visualizerEngine.getCurrentStep());
    });

    setState(visualizerEngine.getState());
    setCurrentStep(visualizerEngine.getCurrentStep());
    setCurrentLessonByAlgorithm(algorithmId);

    return () => {
      unsubscribe();
      visualizerEngine.pause();
    };
  }, [algorithmId, setCurrentLessonByAlgorithm]);

  useEffect(() => {
    visualizerEngine.setSpeed(animationSpeed);
  }, [animationSpeed]);

  useEffect(() => {
    if (atFinalStep) {
      setStepProgress((prev) => ({ ...prev, visualize: true }));
    }
  }, [atFinalStep]);

  const lessonMeta = lessonId ? getLessonMeta(lessonId) : getLessonByAlgorithmId(algorithmId);
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

  const handleComplete = async (quizScore: number) => {
    const lessonKey = lessonId ?? algorithmId;
    setIsCompleting(true);
    try {
      const result = await completeLesson(lessonKey, quizScore);
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
          <section className="flex min-h-[420px] flex-col gap-4">
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
            lessonName={lessonName}
            questions={quizQuestions}
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
