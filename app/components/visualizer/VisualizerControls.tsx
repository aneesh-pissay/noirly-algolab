'use client';

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react';

interface Props {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const SPEEDS = [0.5, 1, 2];

const iconButton =
  'focusable flex h-10 w-10 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-line-strong hover:bg-surface-2 disabled:opacity-40';

export default function VisualizerControls({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onReset,
  onSpeedChange,
}: Props) {
  const shown = totalSteps > 0 ? currentStep + 1 : 0;
  const progress = totalSteps > 0 ? (shown / totalSteps) * 100 : 0;

  return (
    <div className="surface rounded-[var(--r-lg)] p-4" role="group" aria-label="Playback controls">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-xs text-fg-2">
          Step <span className="matrix-numeral text-fg">{shown}</span> / {totalSteps}
        </span>
        <div className="flex items-center gap-1" role="group" aria-label="Playback speed">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSpeedChange(s)}
              aria-pressed={speed === s}
              aria-keyshortcuts={s === SPEEDS[0] ? '[' : s === SPEEDS[SPEEDS.length - 1] ? ']' : undefined}
              className={`focusable rounded-full px-2.5 py-1 font-mono text-[11px] transition ${
                speed === s ? 'bg-accent-soft text-fg shadow-[inset_0_0_0_1px_var(--accent)]' : 'text-fg-2 hover:text-fg'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      <div
        className="mb-4 h-1.5 overflow-hidden rounded-full bg-surface-2"
        role="progressbar"
        aria-label="Visualization progress"
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-valuenow={shown}
      >
        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentStep <= 0}
          aria-label="Previous step"
          aria-keyshortcuts="ArrowLeft"
          className={iconButton}
        >
          <SkipBack size={16} aria-hidden />
        </button>
        <button
          type="button"
          onClick={isPlaying ? onPause : onPlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          aria-keyshortcuts="Space"
          className="focusable flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-ink transition hover:brightness-110"
        >
          {isPlaying ? <Pause size={18} aria-hidden /> : <Play size={18} className="ml-0.5" aria-hidden />}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={currentStep >= totalSteps - 1}
          aria-label="Next step"
          aria-keyshortcuts="ArrowRight"
          className={iconButton}
        >
          <SkipForward size={16} aria-hidden />
        </button>
        <button type="button" onClick={onReset} aria-label="Reset" aria-keyshortcuts="R" className={iconButton}>
          <RotateCcw size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
