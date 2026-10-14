import { create } from 'zustand';

/**
 * Counts saves in flight (progress sync, lesson completion, settings) so the
 * global SavingIndicator can show them. Wrap the request in `trackSave`.
 */
interface SavingState {
  pending: number;
}

export const useSavingStore = create<SavingState>(() => ({ pending: 0 }));

export async function trackSave<T>(work: Promise<T>): Promise<T> {
  useSavingStore.setState((s) => ({ pending: s.pending + 1 }));
  try {
    return await work;
  } finally {
    useSavingStore.setState((s) => ({ pending: Math.max(0, s.pending - 1) }));
  }
}
