import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getInitialProgress } from '@/src/features/progress/progress.utils';
import { getLessonQuiz } from '@/src/server/quiz/bank';

const USER_ID = '65f000000000000000000001';

const state = vi.hoisted(() => ({
  doc: null as (Record<string, unknown> & { save: () => Promise<void> }) | null,
  saves: 0,
  limited: false,
}));

vi.mock('@/src/server/auth/session', () => ({ requireUser: async () => ({ userId: USER_ID, identitySub: 'sub' }) }));
vi.mock('@/lib/mongodb', () => ({ default: async () => undefined }));
vi.mock('@/models/User', () => ({ default: { findById: async () => ({ _id: USER_ID, xp: 0, streak: 0, lastActiveDate: null }) } }));
vi.mock('@/lib/user-collections', () => ({ ensureUserCurriculumProgress: async () => state.doc }));
vi.mock('@/src/server/security/rate-limit', () => ({
  consumeRateLimit: async () => ({ allowed: !state.limited, remaining: 0, retryAfterSeconds: 30 }),
}));

import { POST } from '@/app/api/quiz/submit/route';

const LESSON = getInitialProgress().unlockedLessons[0];
const quiz = getLessonQuiz(LESSON)!;
const right = quiz.questions.map((q) => ({ questionId: q.id, choiceIndex: q.correctAnswer }));
const wrong = quiz.questions.map((q) => ({ questionId: q.id, choiceIndex: (q.correctAnswer + 1) % q.options.length }));

function request(body: unknown) {
  return new Request('http://localhost/api/quiz/submit', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
}

beforeEach(() => {
  state.saves = 0;
  state.limited = false;
  state.doc = {
    ...getInitialProgress(),
    lastPassedAttempt: null,
    save: async () => {
      state.saves += 1;
    },
  };
});

describe('POST /api/quiz/submit', () => {
  it('grades on the server and records a pass', async () => {
    const res = await POST(request({ lessonId: LESSON, answers: right }));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ passed: true, score: 100 });
    expect(state.doc!.lastPassedAttempt).toMatchObject({ lessonId: LESSON, score: 100, templated: quiz.templated });
    expect(state.saves).toBe(1);
  });

  it('records nothing for a failed attempt', async () => {
    const res = await POST(request({ lessonId: LESSON, answers: wrong }));
    expect(await res.json()).toMatchObject({ passed: false });
    expect(state.doc!.lastPassedAttempt).toBeNull();
  });

  it('ignores a client-claimed score', async () => {
    const res = await POST(request({ lessonId: LESSON, answers: wrong, score: 100, passed: true }));
    expect(await res.json()).toMatchObject({ passed: false });
  });

  it('refuses locked lessons', async () => {
    const lockedQuiz = getLessonQuiz('array-histogram')!;
    const answers = lockedQuiz.questions.map((q) => ({ questionId: q.id, choiceIndex: q.correctAnswer }));
    expect((await POST(request({ lessonId: 'array-histogram', answers }))).status).toBe(403);
  });

  it('is rate limited', async () => {
    state.limited = true;
    const res = await POST(request({ lessonId: LESSON, answers: right }));
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('30');
  });
});
