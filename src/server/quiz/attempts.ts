import type { PassedQuizAttempt } from '@/models/UserCurriculumProgress';

/** A passed quiz counts toward completing its lesson for this long. */
export const PASSED_ATTEMPT_TTL_MS = 24 * 60 * 60 * 1000;

/** True when `attempt` is a recent server-graded pass for `lessonId`. */
export function isValidPassedAttempt(
  attempt: PassedQuizAttempt | null | undefined,
  lessonId: string,
  now = Date.now(),
): attempt is PassedQuizAttempt {
  return Boolean(attempt && attempt.lessonId === lessonId && now - new Date(attempt.passedAt).getTime() < PASSED_ATTEMPT_TTL_MS);
}
