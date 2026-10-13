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

/** Needs a quiz for this lesson that the server graded as passed. */
export async function completeLesson(lessonId: string): Promise<CompleteLessonApiResponse> {
  return apiJson<CompleteLessonApiResponse>(
    '/api/progress/complete',
    { method: 'POST', body: JSON.stringify({ lessonId }) },
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

export type { UserProgress };
