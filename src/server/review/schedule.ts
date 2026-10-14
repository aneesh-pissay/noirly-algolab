/**
 * Spaced review of missed quiz questions (spec F8). A missed question comes
 * back after 1 day; each correct review pushes it out to 3, then 7 days, and
 * a correct answer at 7 days retires it. A wrong review starts over at 1 day.
 */
export interface ReviewItem {
  lessonId: string;
  questionId: string;
  /** 0 → due 1 day after a miss, 1 → 3 days, 2 → 7 days. */
  stage: number;
  dueAt: Date;
  missedAt: Date;
}

export const REVIEW_INTERVAL_DAYS = [1, 3, 7] as const;
export const MAX_REVIEW_ITEMS = 100;

const DAY_MS = 24 * 60 * 60 * 1000;
const same = (item: ReviewItem, lessonId: string, questionId: string) => item.lessonId === lessonId && item.questionId === questionId;

/** Adds (or resets) missed questions; the oldest items drop off past the cap. */
export function addMissed(queue: ReviewItem[], lessonId: string, questionIds: string[], now = new Date()): ReviewItem[] {
  const dueAt = new Date(now.getTime() + REVIEW_INTERVAL_DAYS[0] * DAY_MS);
  const missed = new Set(questionIds);
  const kept = queue.filter((item) => !(item.lessonId === lessonId && missed.has(item.questionId)));
  const added = questionIds.map((questionId) => ({ lessonId, questionId, stage: 0, dueAt, missedAt: now }));
  return [...kept, ...added].sort((a, b) => a.missedAt.getTime() - b.missedAt.getTime()).slice(-MAX_REVIEW_ITEMS);
}

export function dueItems(queue: ReviewItem[], now = new Date()): ReviewItem[] {
  return queue.filter((item) => item.dueAt.getTime() <= now.getTime()).sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
}

/** The queue after a review answer, and when the question is due next (null = retired). */
export function applyReviewAnswer(
  queue: ReviewItem[],
  lessonId: string,
  questionId: string,
  correct: boolean,
  now = new Date(),
): { queue: ReviewItem[]; nextDueAt: Date | null } {
  const item = queue.find((i) => same(i, lessonId, questionId));
  if (!item) return { queue, nextDueAt: null };
  const rest = queue.filter((i) => i !== item);
  const stage = correct ? item.stage + 1 : 0;
  if (stage >= REVIEW_INTERVAL_DAYS.length) return { queue: rest, nextDueAt: null };
  const nextDueAt = new Date(now.getTime() + REVIEW_INTERVAL_DAYS[stage] * DAY_MS);
  return { queue: [...rest, { ...item, stage, dueAt: nextDueAt }], nextDueAt };
}
