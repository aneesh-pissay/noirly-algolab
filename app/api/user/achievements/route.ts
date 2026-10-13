import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/src/server/auth/session';
import connectDB from '@/lib/mongodb';
import UserAchievement from '@/models/UserAchievement';

// GET /api/user/achievements - Get user achievements
export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireUser();

    await connectDB();

    const { searchParams } = new URL(request.url);
    const unlocked = searchParams.get('unlocked');

    let query: any = { userId: userId };
    if (unlocked === 'true') query.isUnlocked = true;
    if (unlocked === 'false') query.isUnlocked = false;

    const achievements = await UserAchievement.find(query).sort({ unlockedAt: -1, createdAt: -1 });

    return NextResponse.json({ achievements });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Get achievements error:', error);
    return NextResponse.json({ error: 'Failed to get achievements' }, { status: 500 });
  }
}

// POST /api/user/achievements - Unlock an achievement
export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireUser();

    const {
      achievementId,
      title,
      description,
      category,
      icon,
      xpReward,
      rarity,
    } = await request.json();

    if (!achievementId || !title || !description || !category || !icon) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if achievement already exists
    let achievement = await UserAchievement.findOne({
      userId: userId,
      achievementId,
    });

    if (achievement && achievement.isUnlocked) {
      return NextResponse.json(
        { error: 'Achievement already unlocked' },
        { status: 400 }
      );
    }

    // Create or update achievement
    achievement = await UserAchievement.findOneAndUpdate(
      { userId: userId, achievementId },
      {
        $set: {
          title,
          description,
          category,
          icon,
          xpReward: xpReward || 0,
          rarity: rarity || 'common',
          progress: 100,
          isUnlocked: true,
          unlockedAt: new Date(),
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    // Achievements are recorded, but XP is only earned from server-graded
    // lesson quizzes; a client-supplied xpReward never changes a user's XP.
    const awardedXp = 0;
    const leveledUp = false;
    const currentLevel: number | null = null;

    return NextResponse.json({
      message: 'Achievement unlocked!',
      achievement,
      xpGained: awardedXp,
      leveledUp,
      currentLevel,
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Unlock achievement error:', error);
    return NextResponse.json({ error: 'Failed to unlock achievement' }, { status: 500 });
  }
}
