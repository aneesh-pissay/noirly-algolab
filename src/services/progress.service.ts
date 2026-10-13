import type { AggregatedUserProgress } from '@/lib/curriculum-progress';
import { apiJson } from '@/src/lib/api-client';
import type { CompleteLessonResult, UserProgress } from '@/src/features/progress/progress.types';

export type ProgressApiResponse = AggregatedUserProgress;

export interface CompleteLessonApiResponse {
  progress: ProgressApiResponse;
  result: CompleteLessonResult;
}

export async function getUserProgress(): Promise<ProgressApiResponse> {
  return apiJson<ProgressApiResponse>('/api/progress', {}, 'Failed to load progress');
}

export async function completeLesson(
  lessonIdOrAlgorithmId: string,
  quizScore = 100
): Promise<CompleteLessonApiResponse> {
  return apiJson<CompleteLessonApiResponse>(
    '/api/progress/complete',
    { method: 'POST', body: JSON.stringify({ lessonId: lessonIdOrAlgorithmId, quizScore }) },
    'Failed to complete lesson',
  );
}

export async function updateCurrentLesson(lessonId: string): Promise<ProgressApiResponse> {
  return apiJson<ProgressApiResponse>(
    '/api/progress',
    { method: 'PATCH', body: JSON.stringify({ currentLesson: lessonId }) },
    'Failed to update current lesson',
  );
}

export async function updateXP(amount: number): Promise<never> {
  throw new Error('updateXP is handled server-side via completeLesson');
}

export async function unlockLesson(lessonId: string): Promise<never> {
  throw new Error('unlockLesson is handled server-side via completeLesson');
}

export type { UserProgress };
