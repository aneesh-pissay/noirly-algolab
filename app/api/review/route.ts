import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ensureUserCurriculumProgress } from '@/lib/user-collections';
import { findLessonById } from '@/app/data/curriculum';
import { requireUser } from '@/src/server/auth/session';
import { getLessonQuiz } from '@/src/server/quiz/bank';
import { dueItems } from '@/src/server/review/schedule';

// GET /api/review — questions due for spaced review (without answers).
export async function GET() {
  try {
    const { userId } = await requireUser();
    await connectDB();
    const doc = await ensureUserCurriculumProgress(userId);
    const queue = doc.reviewQueue ?? [];
    const now = new Date();

    const due = dueItems(queue, now)
      .map((item) => {
        const question = getLessonQuiz(item.lessonId)?.questions.find((q) => q.id === item.questionId);
        const lesson = findLessonById(item.lessonId)?.lesson;
        return question && lesson
          ? { lessonId: item.lessonId, lessonName: lesson.name, questionId: question.id, question: question.question, options: question.options, stage: item.stage }
          : null;
      })
      .filter(Boolean)
      .slice(0, 10);

    const upcoming = queue.filter((item) => item.dueAt.getTime() > now.getTime()).map((item) => item.dueAt.getTime());
    return NextResponse.json({
      due,
      dueCount: dueItems(queue, now).length,
      nextDueAt: upcoming.length ? new Date(Math.min(...upcoming)).toISOString() : null,
      total: queue.length,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('GET /api/review error:', error);
    return NextResponse.json({ error: 'Failed to load review' }, { status: 500 });
  }
}
