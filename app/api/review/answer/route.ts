import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import { ensureUserCurriculumProgress } from '@/lib/user-collections';
import { readJsonBody } from '@/src/server/api/json';
import { requireUser } from '@/src/server/auth/session';
import { getLessonQuiz } from '@/src/server/quiz/bank';
import { applyReviewAnswer } from '@/src/server/review/schedule';
import { consumeRateLimit } from '@/src/server/security/rate-limit';

const AnswerSchema = z.object({
  lessonId: z.string().min(1).max(120),
  questionId: z.string().min(1).max(200),
  choiceIndex: z.number().int().min(0).max(50),
});

// POST /api/review/answer — grades one review question and reschedules it.
export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const limit = await consumeRateLimit(`review-answer:${userId}`, 60, 60);
    if (!limit.allowed) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } });
    }
    const { lessonId, questionId, choiceIndex } = await readJsonBody(request, AnswerSchema);

    await connectDB();
    const doc = await ensureUserCurriculumProgress(userId);
    const queue = doc.reviewQueue ?? [];
    if (!queue.some((item) => item.lessonId === lessonId && item.questionId === questionId)) {
      return NextResponse.json({ error: 'Not in your review queue' }, { status: 404 });
    }
    const question = getLessonQuiz(lessonId)?.questions.find((q) => q.id === questionId);
    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    const correct = choiceIndex === question.correctAnswer;
    const { queue: next, nextDueAt } = applyReviewAnswer(queue, lessonId, questionId, correct);
    doc.reviewQueue = next;
    await doc.save();

    return NextResponse.json({
      correct,
      correctIndex: question.correctAnswer,
      explanation: question.explanation,
      nextDueAt: nextDueAt?.toISOString() ?? null,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('POST /api/review/answer error:', error);
    return NextResponse.json({ error: 'Failed to record the review' }, { status: 500 });
  }
}
