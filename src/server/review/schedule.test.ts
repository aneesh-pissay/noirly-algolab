import { describe, expect, it } from 'vitest';
import { addMissed, applyReviewAnswer, dueItems, MAX_REVIEW_ITEMS } from './schedule';

const day = 24 * 60 * 60 * 1000;
const t0 = new Date('2026-10-01T10:00:00Z');
const at = (days: number) => new Date(t0.getTime() + days * day);

describe('spaced review schedule', () => {
  it('brings a missed question back after 1, 3 and 7 days, then retires it', () => {
    let queue = addMissed([], 'sort-quick', ['q1'], t0);
    expect(dueItems(queue, at(0.5))).toHaveLength(0);
    expect(dueItems(queue, at(1))).toHaveLength(1);

    let result = applyReviewAnswer(queue, 'sort-quick', 'q1', true, at(1));
    expect(result.nextDueAt).toEqual(at(4));
    queue = result.queue;
    result = applyReviewAnswer(queue, 'sort-quick', 'q1', true, at(4));
    expect(result.nextDueAt).toEqual(at(11));
    result = applyReviewAnswer(result.queue, 'sort-quick', 'q1', true, at(11));
    expect(result.nextDueAt).toBeNull();
    expect(result.queue).toHaveLength(0);
  });

  it('starts over after a wrong review', () => {
    let queue = addMissed([], 'l', ['q'], t0);
    queue = applyReviewAnswer(queue, 'l', 'q', true, at(1)).queue;
    const result = applyReviewAnswer(queue, 'l', 'q', false, at(4));
    expect(result.nextDueAt).toEqual(at(5));
    expect(result.queue[0].stage).toBe(0);
  });

  it('resets rather than duplicates a question missed again', () => {
    let queue = addMissed([], 'l', ['q'], t0);
    queue = applyReviewAnswer(queue, 'l', 'q', true, at(1)).queue;
    queue = addMissed(queue, 'l', ['q'], at(2));
    expect(queue).toHaveLength(1);
    expect(queue[0]).toMatchObject({ stage: 0, dueAt: at(3) });
  });

  it('caps the queue, dropping the oldest misses', () => {
    let queue = addMissed([], 'old', ['q'], t0);
    for (let i = 0; i < MAX_REVIEW_ITEMS; i += 1) queue = addMissed(queue, `l${i}`, ['q'], at(1 + i / 1000));
    expect(queue).toHaveLength(MAX_REVIEW_ITEMS);
    expect(queue.some((item) => item.lessonId === 'old')).toBe(false);
  });

  it('ignores answers for questions not in the queue', () => {
    expect(applyReviewAnswer([], 'l', 'q', true, t0)).toEqual({ queue: [], nextDueAt: null });
  });
});
