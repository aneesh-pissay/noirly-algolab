import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { buildAggregatedProgress } from '@/lib/curriculum-progress';
import { ensureUserCurriculumProgress } from '@/lib/user-collections';
import { requireUser } from '@/src/server/auth/session';
import { getLessonQuiz, toPublicQuiz } from '@/src/server/quiz/bank';

// GET /api/quiz/:lessonId — the lesson's questions, without answers.
export async function GET(_request: Request, { params }: { params: Promise<{ lessonId: string }> }) {
  try {
    const { userId } = await requireUser();
    const { lessonId } = await params;
    const quiz = getLessonQuiz(lessonId);
    if (!quiz) return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });

    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const progress = buildAggregatedProgress(user, await ensureUserCurriculumProgress(userId));
    if (!progress.unlockedLessons.includes(lessonId) && !progress.completedLessons.includes(lessonId)) {
      return NextResponse.json({ error: 'lesson_locked' }, { status: 403 });
    }

    return NextResponse.json(toPublicQuiz(quiz));
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('GET /api/quiz error:', error);
    return NextResponse.json({ error: 'Failed to load quiz' }, { status: 500 });
  }
}
