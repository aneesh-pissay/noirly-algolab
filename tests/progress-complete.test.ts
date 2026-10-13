import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getInitialProgress } from '@/src/features/progress/progress.utils';

/**
 * /api/progress/complete must not trust the client (spec 5.1, B5, B8):
 * no completion without a server-graded pass, no completion of locked
 * lessons, and a client-sent score has no effect.
 */

const USER_ID = '65f000000000000000000001';

const state = vi.hoisted(() => ({
  user: null as Record<string, unknown> | null,
  doc: null as Record<string, unknown> | null,
  userUpdates: [] as Record<string, unknown>[],
  saved: [] as Record<string, unknown>[],
}));

vi.mock('@/src/server/auth/session', () => ({ requireUser: async () => ({ userId: USER_ID, identitySub: 'sub' }) }));
vi.mock('@/lib/mongodb', () => ({ default: async () => undefined, withDb: (fn: () => unknown) => fn() }));
vi.mock('@/models/User', () => ({
  default: {
    findById: async () => state.user,
    findByIdAndUpdate: async (_id: string, update: { $set: Record<string, unknown> }) => {
      state.userUpdates.push(update.$set);
      Object.assign(state.user!, update.$set);
    },
  },
}));
vi.mock('@/lib/user-collections', () => ({
  ensureUserCurriculumProgress: async () => state.doc,
  saveCurriculumProgress: async (_id: string, doc: Record<string, unknown>, updates: Record<string, unknown>) => {
    Object.assign(doc, updates);
    state.saved.push(updates);
  },
  syncLegacyTopicProgress: async () => undefined,
}));

import { POST } from '@/app/api/progress/complete/route';

function request(body: unknown) {
  return new Request('http://localhost/api/progress/complete', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

const FIRST = getInitialProgress().unlockedLessons[0]; // array-traversal

beforeEach(() => {
  const initial = getInitialProgress();
  state.user = { _id: USER_ID, xp: 0, streak: 0, lastActiveDate: null };
  state.doc = { ...initial, lastPassedAttempt: null };
  state.userUpdates = [];
  state.saved = [];
});

describe('POST /api/progress/complete', () => {
  it('refuses without a passed quiz, whatever score the client sends', async () => {
    const res = await POST(request({ lessonId: FIRST, quizScore: 100 }));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: 'quiz_not_passed' });
    expect(state.saved).toEqual([]);
    expect(state.userUpdates).toEqual([]);
  });

  it('refuses a pass recorded for a different lesson', async () => {
    state.doc!.lastPassedAttempt = { lessonId: 'array-insert', score: 100, templated: false, passedAt: new Date() };
    const res = await POST(request({ lessonId: FIRST }));
    expect(res.status).toBe(403);
  });

  it('refuses an expired pass', async () => {
    state.doc!.lastPassedAttempt = { lessonId: FIRST, score: 100, templated: false, passedAt: new Date(Date.now() - 2 * 24 * 3600_000) };
    expect((await POST(request({ lessonId: FIRST }))).status).toBe(403);
  });

  it('refuses a locked lesson even with a recorded pass (B8)', async () => {
    const locked = 'array-histogram';
    state.doc!.lastPassedAttempt = { lessonId: locked, score: 100, templated: false, passedAt: new Date() };
    const res = await POST(request({ lessonId: locked }));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: 'lesson_locked' });
    expect(state.saved).toEqual([]);
  });

  it('completes with the server-graded score, ignoring a tampered client score', async () => {
    state.doc!.lastPassedAttempt = { lessonId: FIRST, score: 70, templated: false, passedAt: new Date() };
    const res = await POST(request({ lessonId: FIRST, quizScore: 100 }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.progress.completedLessons).toContain(FIRST);
    expect(body.result.xpBreakdown.quizScore).toBe(70);
    expect(body.progress.unlockedLessons).toContain('array-insert');
  });

  it('awards no XP for a templated quiz (B7)', async () => {
    state.doc!.lastPassedAttempt = { lessonId: FIRST, score: 100, templated: true, passedAt: new Date() };
    const body = await (await POST(request({ lessonId: FIRST }))).json();
    expect(body.result.xpEarned).toBe(0);
    expect(body.progress.completedLessons).toContain(FIRST);
  });

  it('treats completing an already-completed lesson as a no-op', async () => {
    state.doc!.completedLessons = [FIRST];
    const res = await POST(request({ lessonId: FIRST }));
    expect(res.status).toBe(200);
    expect((await res.json()).result.xpEarned).toBe(0);
    expect(state.saved).toEqual([]);
  });

  it('rejects malformed bodies', async () => {
    expect((await POST(request({ lessonId: { $gt: '' } }))).status).toBe(400);
  });

  it('404s an unknown lesson', async () => {
    state.doc!.lastPassedAttempt = { lessonId: 'nope', score: 100, templated: false, passedAt: new Date() };
    expect((await POST(request({ lessonId: 'nope' }))).status).toBe(404);
  });
});
