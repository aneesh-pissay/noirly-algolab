import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { buildAggregatedProgress, completeLessonForUser } from '@/lib/curriculum-progress';
import { ensureUserCurriculumProgress, saveCurriculumProgress, syncLegacyTopicProgress } from '@/lib/user-collections';
import { readJsonBody } from '@/src/server/api/json';
import { requireUser } from '@/src/server/auth/session';
import { isValidPassedAttempt } from '@/src/server/quiz/attempts';

// Extra keys (an old client's `quizScore`) are accepted and ignored.
const CompleteSchema = z.object({ lessonId: z.string().min(1).max(120) });

/**
 * POST /api/progress/complete — completes a lesson and persists XP + unlocks.
 * Takes no score from the client (spec 5.1): it needs a quiz for this lesson
 * that /api/quiz/submit graded as passed, and the lesson must be unlocked
 * (spec B8). Completing an already-completed lesson is a no-op.
 */
export async function POST(request: Request) {
  try {
    const { userId } = await requireUser();
    const { lessonId } = await readJsonBody(request, CompleteSchema);

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const doc = await ensureUserCurriculumProgress(userId);
    const alreadyCompleted = (doc.completedLessons ?? []).includes(lessonId);
    const attempt = doc.lastPassedAttempt;
    const attemptValid = isValidPassedAttempt(attempt, lessonId);
    if (!alreadyCompleted && !attemptValid) {
      return NextResponse.json({ error: 'quiz_not_passed' }, { status: 403 });
    }

    const outcome = completeLessonForUser(user, doc, lessonId, {
      score: attemptValid ? attempt.score : 0,
      templated: attemptValid ? attempt.templated : true,
    });
    if (!outcome) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    if ('error' in outcome) {
      return NextResponse.json({ error: 'lesson_locked' }, { status: 403 });
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
