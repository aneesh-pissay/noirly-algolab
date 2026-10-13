import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/src/server/auth/session';
import connectDB from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';

// GET /api/user/progress - Get user learning progress
export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireUser();

    await connectDB();

    const { searchParams } = new URL(request.url);
    const levelId = searchParams.get('levelId');
    const topicSlug = searchParams.get('topicSlug');

    let query: any = { userId: userId };
    if (levelId) query.levelId = parseInt(levelId);
    if (topicSlug) query.topicSlug = topicSlug;

    const progress = await UserProgress.find(query).sort({ lastAccessedAt: -1 });

    return NextResponse.json({ progress });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Get progress error:', error);
    return NextResponse.json({ error: 'Failed to get progress' }, { status: 500 });
  }
}

// POST /api/user/progress - Create or update progress
export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireUser();

    const { levelId, topicSlug, topicTitle, status, progress, timeSpent, score, notes, isBookmarked } =
      await request.json();

    if (!levelId || !topicSlug || !topicTitle) {
      return NextResponse.json(
        { error: 'levelId, topicSlug, and topicTitle are required' },
        { status: 400 }
      );
    }

    // Plain values only: an object here would become a Mongo operator.
    if (typeof topicSlug !== 'string' || typeof topicTitle !== 'string' || !Number.isInteger(levelId)) {
      return NextResponse.json({ error: 'Invalid progress payload' }, { status: 400 });
    }

    await connectDB();

    const updateData: any = {
      userId: userId,
      levelId,
      topicSlug,
      topicTitle,
      lastAccessedAt: new Date(),
    };

    if (status !== undefined) updateData.status = status;
    if (progress !== undefined) updateData.progress = progress;
    if (timeSpent !== undefined) updateData.$inc = { timeSpent };
    if (score !== undefined) updateData.score = score;
    if (notes !== undefined) updateData.notes = notes;
    if (isBookmarked !== undefined) updateData.isBookmarked = isBookmarked;

    // If completing, set completedAt and increment attempts
    if (status === 'completed' && progress === 100) {
      updateData.completedAt = new Date();
      updateData.$inc = { ...updateData.$inc, attempts: 1 };
    }

    const userProgress = await UserProgress.findOneAndUpdate(
      { userId: userId, topicSlug },
      updateData,
      { new: true, upsert: true, runValidators: true }
    );

    // XP is awarded only by /api/progress/complete, after a server-graded
    // quiz. This legacy per-topic record never grants XP from client values.
    const awardedXp = 0;
    const leveledUp = false;
    const currentLevel: number | null = null;

    return NextResponse.json({
      message: 'Progress updated successfully',
      progress: userProgress,
      xpGained: awardedXp,
      leveledUp,
      currentLevel,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Update progress error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
