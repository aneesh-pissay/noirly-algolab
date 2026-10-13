import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/src/server/auth/session';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import {
  buildAggregatedProgress,
  completeLessonForUser,
} from '@/lib/curriculum-progress';
import {
  ensureUserCurriculumProgress,
  saveCurriculumProgress,
  syncLegacyTopicProgress,
} from '@/lib/user-collections';

// POST /api/progress/complete — complete a lesson and persist XP + unlocks
export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireUser();

    const { lessonId, algorithmId, quizScore } = await request.json();
    const targetId = lessonId ?? algorithmId;
    const score = typeof quizScore === 'number' ? Math.max(70, Math.min(100, Math.round(quizScore))) : 100;

    if (!targetId || typeof targetId !== 'string') {
      return NextResponse.json({ error: 'lessonId or algorithmId is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const doc = await ensureUserCurriculumProgress(userId);

    const outcome = completeLessonForUser(user, doc, targetId, score);
    if (!outcome) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    if (Object.keys(outcome.userUpdates).length > 0) {
      await User.findByIdAndUpdate(userId, { $set: outcome.userUpdates }, { runValidators: true });
    }

    if (Object.keys(outcome.docUpdates).length > 0) {
      await saveCurriculumProgress(userId, doc, outcome.docUpdates);
      await syncLegacyTopicProgress(userId, outcome.result.lesson);
    }

    const refreshedUser = await User.findById(userId);
    const refreshedDoc = await ensureUserCurriculumProgress(userId);

    if (!refreshedUser || !refreshedDoc) {
      return NextResponse.json({ error: 'Failed to load saved progress' }, { status: 500 });
    }

    return NextResponse.json({
      progress: buildAggregatedProgress(refreshedUser, refreshedDoc),
      result: outcome.result,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('POST /api/progress/complete error:', error);
    return NextResponse.json({ error: 'Failed to complete lesson' }, { status: 500 });
  }
}
