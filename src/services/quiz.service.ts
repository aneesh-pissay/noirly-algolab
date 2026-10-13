import { apiJson } from '@/src/lib/api-client';

export interface PublicQuizQuestion {
  id: string;
  question: string;
  options: string[];
}

export interface PublicQuiz {
  lessonId: string;
  templated: boolean;
  passScore: number;
  questions: PublicQuizQuestion[];
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  chosenIndex: number | null;
  correctIndex: number;
  explanation: string;
}

export interface QuizGrade {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  templated: boolean;
  results: QuizResult[];
}

export function getQuiz(lessonId: string): Promise<PublicQuiz> {
  return apiJson<PublicQuiz>(`/api/quiz/${encodeURIComponent(lessonId)}`, {}, 'Failed to load the quiz');
}

export function submitQuiz(lessonId: string, answers: { questionId: string; choiceIndex: number }[]): Promise<QuizGrade> {
  return apiJson<QuizGrade>('/api/quiz/submit', { method: 'POST', body: JSON.stringify({ lessonId, answers }) }, 'Failed to submit the quiz');
}
