import { apiJson } from '@/src/lib/api-client';

export interface ReviewQuestion {
  lessonId: string;
  lessonName: string;
  questionId: string;
  question: string;
  options: string[];
  stage: number;
}

export interface ReviewQueueResponse {
  due: ReviewQuestion[];
  dueCount: number;
  nextDueAt: string | null;
  total: number;
}

export interface ReviewAnswerResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;
  nextDueAt: string | null;
}

export function getReview(): Promise<ReviewQueueResponse> {
  return apiJson<ReviewQueueResponse>('/api/review', {}, 'Failed to load review');
}

export function answerReview(body: { lessonId: string; questionId: string; choiceIndex: number }): Promise<ReviewAnswerResult> {
  return apiJson<ReviewAnswerResult>('/api/review/answer', { method: 'POST', body: JSON.stringify(body) }, 'Failed to save the answer');
}
