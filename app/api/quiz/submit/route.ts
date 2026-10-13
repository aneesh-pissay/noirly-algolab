import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { buildAggregatedProgress } from '@/lib/curriculum-progress';
import { ensureUserCurriculumProgress } from '@/lib/user-collections';
import { readJsonBody } from '@/src/server/api/json';
import { requireUser } from '@/src/server/auth/session';
import { gradeQuiz, getLessonQuiz } from '@/src/server/quiz/bank';
import { consumeRateLimit } from '@/src/server/security/rate-limit';

const SubmitSchema = z.object({
  lessonId: z.string().min(1).max(120),
  answers: z
    .array(z.object({ questionId: z.string().min(1).max(200), choiceIndex: z.number().int().min(0).max(50) }))
    .max(50),
});

/**
 * POST /api/quiz/submit — grades a quiz on the server (spec 5.1).
 * A pass is recorded as the learner's `lastPassedAttempt`, which
 * /api/progress/complete requires. The response reveals the correct answers
 * and explanations only now, after submission.
 */
export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const limit = await consumeRateLimit(`quiz-submit:${userId}`, 20, 60);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } });
    }

    const { lessonId, answers } = await readJsonBody(request, SubmitSchema);
    const quiz = getLessonQuiz(lessonId);
    if (!quiz) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const doc = await ensureUserCurriculumProgress(userId);
    const progress = buildAggregatedProgress(user, doc);
    if (!progress.unlockedLessons.includes(lessonId) && !progress.completedLessons.includes(lessonId)) {
      return NextResponse.json({ error: 'lesson_locked' }, { status: 403 });
    }

    const grade = gradeQuiz(quiz, answers);
    if (grade.passed) {
      doc.lastPassedAttempt = { lessonId, score: grade.score, templated: quiz.templated, passedAt: new Date() };
      await doc.save();
    }

    return NextResponse.json({ ...grade, templated: quiz.templated });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('POST /api/quiz/submit error:', error);
    return NextResponse.json({ error: 'Failed to grade quiz' }, { status: 500 });
  }
}
