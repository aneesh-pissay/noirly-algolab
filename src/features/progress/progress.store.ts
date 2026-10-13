'use client';

import { create } from 'zustand';
import type { CompleteLessonResult, UserProgress } from './progress.types';
import { getInitialProgress, getLessonById, getLessonStatus } from './progress.utils';
import * as progressAPI from '@/src/services/progress.service';
import { trackSave } from '@/src/stores/saving';

/** Stable fallback — must not allocate a new object per selector call (React 19 / useSyncExternalStore). */
const CACHED_INITIAL_PROGRESS = getInitialProgress();

interface ProgressStore {
  progress: UserProgress | null;
  loading: boolean;
  error: string | null;
  isReady: boolean;
  loadProgress: () => Promise<void>;
  reset: () => void;
  setCurrentLessonByAlgorithm: (algorithmId: string) => Promise<void>;
  completeLesson: (lessonIdOrAlgorithmId: string, quizScore?: number) => Promise<CompleteLessonResult | null>;
  getLessonStatus: (lessonId: string) => import('./progress.types').LessonStatusType;
  isLessonCompleted: (lessonId: string) => boolean;
  isLessonUnlocked: (lessonId: string) => boolean;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: null,
  loading: false,
  error: null,
  isReady: false,

  reset: () => set({ progress: null, loading: false, error: null, isReady: false }),

  loadProgress: async () => {
    set({ loading: true, error: null });
    try {
      const data = await progressAPI.getUserProgress();
      set({ progress: data, loading: false, isReady: true, error: null });
    } catch (error) {
      set({
        progress: CACHED_INITIAL_PROGRESS,
        loading: false,
        isReady: true,
        error: error instanceof Error ? error.message : 'Failed to load progress',
      });
    }
  },

  setCurrentLessonByAlgorithm: async (algorithmId) => {
    const meta = getLessonById(algorithmId);
    const current = get().progress;
    if (!meta || !current) return;
    if (current.completedLessons.includes(meta.id)) return;
    if (!current.unlockedLessons.includes(meta.id)) return;

    set({ progress: { ...current, currentLesson: meta.id } });

    try {
      const updated = await trackSave(progressAPI.updateCurrentLesson(meta.id));
      set({ progress: updated });
    } catch {
      /* keep optimistic current lesson */
    }
  },

  completeLesson: async (lessonIdOrAlgorithmId, quizScore = 100) => {
    const lesson = getLessonById(lessonIdOrAlgorithmId);
    if (!lesson) return null;

    const previous = get().progress;

    try {
      const { progress, result } = await trackSave(progressAPI.completeLesson(lessonIdOrAlgorithmId, quizScore));
      set({ progress, error: null });
      return result;
    } catch (error) {
      set({ progress: previous, error: error instanceof Error ? error.message : 'Failed to complete lesson' });
      return null;
    }
  },

  getLessonStatus: (lessonId) => {
    const state = get().progress ?? CACHED_INITIAL_PROGRESS;
    return getLessonStatus(lessonId, state);
  },

  isLessonCompleted: (lessonId) =>
    (get().progress ?? CACHED_INITIAL_PROGRESS).completedLessons.includes(lessonId),

  isLessonUnlocked: (lessonId) =>
    (get().progress ?? CACHED_INITIAL_PROGRESS).unlockedLessons.includes(lessonId),
}));

export function useProgressHydrated() {
  return useProgressStore((s) => s.isReady);
}

export function useProgressData(): UserProgress {
  return useProgressStore((s) => s.progress ?? CACHED_INITIAL_PROGRESS);
}
