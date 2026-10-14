import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/src/server/auth/session';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { buildAggregatedProgress } from '@/lib/curriculum-progress';
import { ensureUserCurriculumProgress } from '@/lib/user-collections';
import { syncUserStreakIfNeeded } from '@/lib/streak';

// GET /api/progress — aggregated curriculum progress for logged-in user
export async function GET() {
  try {
    const { userId } = await requireUser();

    await connectDB();

    let user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const doc = await ensureUserCurriculumProgress(userId);

    const hasLearningActivity =
      (doc.completedLessons?.length ?? 0) > 0 || (user.xp ?? 0) > 0;

    const streakUpdates = await syncUserStreakIfNeeded(user, hasLearningActivity);
    if (streakUpdates) {
      await User.findByIdAndUpdate(userId, { $set: streakUpdates });
      user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
    }

    const progress = buildAggregatedProgress(user, doc);
    return NextResponse.json(progress);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('GET /api/progress error:', error);
    return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 });
  }
}

// PATCH /api/progress — update current lesson pointer
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await requireUser();

    const { currentLesson } = await request.json();
    if (!currentLesson || typeof currentLesson !== 'string') {
      return NextResponse.json({ error: 'currentLesson is required' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const doc = await ensureUserCurriculumProgress(userId);

    if (!doc.unlockedLessons.includes(currentLesson)) {
      return NextResponse.json({ error: 'Lesson is not unlocked' }, { status: 400 });
    }

    doc.currentLesson = currentLesson;
    await doc.save();

    return NextResponse.json(buildAggregatedProgress(user, doc));
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('PATCH /api/progress error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
