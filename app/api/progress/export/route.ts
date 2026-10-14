import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import UserAchievement from '@/models/UserAchievement';
import UserProgress from '@/models/UserProgress';
import { ensureUserCurriculumProgress, ensureUserSettings } from '@/lib/user-collections';
import { toClientSettings } from '@/lib/settings-mapper';
import { requireUser } from '@/src/server/auth/session';
import { getLessonMeta } from '@/src/features/progress/progress.utils';

/**
 * GET /api/progress/export — everything AlgoLab stores about the learner, as
 * a JSON download (spec F9). Account details themselves live in Noirly
 * Identity; only the copy AlgoLab keeps is included.
 */
export async function GET() {
  try {
    const { userId, identitySub } = await requireUser();
    await connectDB();
    const [user, curriculum, settings, topics, achievements] = await Promise.all([
      User.findById(userId).select('username email firstName lastName avatar xp streak currentLevel lastActiveDate createdAt').lean(),
      ensureUserCurriculumProgress(userId),
      ensureUserSettings(userId),
      UserProgress.find({ userId }).select('-_id -__v -userId').lean(),
      UserAchievement.find({ userId }).select('-_id -__v -userId').lean(),
    ]);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = {
      exportedAt: new Date().toISOString(),
      app: 'Noirly AlgoLab',
      account: {
        identitySub,
        username: user.username,
        email: user.email,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        createdAt: user.createdAt,
      },
      stats: { xp: user.xp ?? 0, streak: user.streak ?? 0, level: user.currentLevel ?? 1, lastActiveDate: user.lastActiveDate ?? null },
      curriculum: {
        completedLessons: (curriculum.completedLessons ?? []).map((id) => ({ id, title: getLessonMeta(id)?.title ?? null })),
        unlockedLessons: curriculum.unlockedLessons ?? [],
        currentLesson: curriculum.currentLesson ?? null,
        recentlyCompleted: curriculum.recentlyCompleted ?? [],
        lastPassedAttempt: curriculum.lastPassedAttempt ?? null,
        reviewQueue: curriculum.reviewQueue ?? [],
      },
      settings: toClientSettings(settings),
      topicProgress: topics,
      achievements,
    };

    const day = new Date().toISOString().slice(0, 10);
    return new NextResponse(JSON.stringify(body, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="noirly-algolab-progress-${day}.json"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('GET /api/progress/export error:', error);
    return NextResponse.json({ error: 'Failed to export progress' }, { status: 500 });
  }
}
