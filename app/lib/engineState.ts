'use client';

import { useSyncExternalStore } from 'react';
import { visualizerEngine } from '@/src/core/engine/VisualizerEngine';
import type { VisualizerState } from '@/src/core/engine/types';

/**
 * React view of the (singleton) visualizer engine state.
 *
 * The engine store returns a fresh copy from getState() and mutates fields
 * in place, so the snapshot is re-used until a field actually changes —
 * useSyncExternalStore needs a stable value between changes.
 */
let cached: VisualizerState = visualizerEngine.getState();

function getSnapshot(): VisualizerState {
  const next = visualizerEngine.getState();
  if (
    next.currentStep !== cached.currentStep ||
    next.totalSteps !== cached.totalSteps ||
    next.isPlaying !== cached.isPlaying ||
    next.speed !== cached.speed ||
    next.steps !== cached.steps ||
    next.algorithm !== cached.algorithm
  ) {
    cached = next;
  }
  return cached;
}

const SERVER_SNAPSHOT: VisualizerState = { currentStep: 0, totalSteps: 0, isPlaying: false, speed: 1, steps: [], algorithm: null };

function subscribe(onChange: () => void): () => void {
  return visualizerEngine.subscribe(onChange);
}

export function useEngineState(): VisualizerState {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}
