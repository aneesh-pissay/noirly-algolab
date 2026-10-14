import type { IUserCurriculumProgress } from '@/models/UserCurriculumProgress';
import type { IUser } from '@/models/User';
import {
  calculateLevel,
  getInitialProgress,
  getLessonMeta,
  getTopicProgress,
  normalizeProgressState,
  reconcileUnlocks,
  resolveUnlocksOnComplete,
} from '@/src/features/progress/progress.utils';
import type { CompleteLessonResult, UserProgress } from '@/src/features/progress/progress.types';
import { getStreakUserUpdates } from '@/lib/streak';
import { calculateLessonXp, getLevelInfo } from '@/lib/gamification';

export interface AggregatedUserProgress extends UserProgress {
  userId: string;
}

function docToLessonState(doc: IUserCurriculumProgress): Omit<UserProgress, 'xp' | 'level' | 'streak' | 'lastActiveDate'> {
  return {
    completedLessons: doc.completedLessons ?? [],
    unlockedLessons: doc.unlockedLessons ?? [],
    unlockedTiers: doc.unlockedTiers ?? [],
    unlockedTopics: doc.unlockedTopics ?? [],
    currentLesson: doc.currentLesson ?? null,
    recentlyCompleted: doc.recentlyCompleted ?? [],
  };
}

export function buildAggregatedProgress(user: IUser, doc: IUserCurriculumProgress): AggregatedUserProgress {
  const lessonState = docToLessonState(doc);
  const xp = user.xp ?? 0;
  return reconcileUnlocks({
    userId: String(user._id),
    ...normalizeProgressState({
      ...lessonState,
      xp,
      level: calculateLevel(xp),
      streak: user.streak ?? 0,
      lastActiveDate: user.lastActiveDate ? user.lastActiveDate.toISOString().slice(0, 10) : null,
    }),
  });
}

export function getDefaultCurriculumDoc(userId: import('mongoose').Types.ObjectId | string) {
  const initial = getInitialProgress();
  return {
    userId,
    completedLessons: initial.completedLessons,
    unlockedLessons: initial.unlockedLessons,
    unlockedTiers: initial.unlockedTiers,
    unlockedTopics: initial.unlockedTopics,
    currentLesson: initial.currentLesson,
    recentlyCompleted: initial.recentlyCompleted,
  };
}

export interface CompletionOutcome {
  progress: AggregatedUserProgress;
  result: CompleteLessonResult;
  userUpdates: Partial<IUser>;
  docUpdates: Partial<IUserCurriculumProgress>;
}

/** A quiz the server graded for this lesson (see /api/quiz/submit). */
export interface GradedAttempt {
  score: number;
  /** Generic complexity questions: completes the lesson but earns no XP (spec B7). */
  templated: boolean;
}

/**
 * Completes a lesson. Unknown ids → null; lessons the learner has not
 * unlocked → `{ error: 'locked' }` (spec B8). Completing twice is a no-op.
 */
export function completeLessonForUser(
  user: IUser,
  doc: IUserCurriculumProgress,
  lessonId: string,
  attempt: GradedAttempt
): CompletionOutcome | { error: 'locked' } | null {
  const lesson = getLessonMeta(lessonId);
  if (!lesson) return null;

  const current = buildAggregatedProgress(user, doc);
  if (!current.completedLessons.includes(lesson.id) && !current.unlockedLessons.includes(lesson.id)) {
    return { error: 'locked' };
  }

  if (current.completedLessons.includes(lesson.id)) {
    const topicProgress = getTopicProgress(lesson.track, lesson.level, lesson.category, current.completedLessons);
    const levelInfo = getLevelInfo(current.xp);
    return {
      progress: current,
      result: {
        lesson,
        xpEarned: 0,
        xpBreakdown: null,
        leveledUp: false,
        previousLevel: levelInfo.level,
        currentLevel: levelInfo.level,
        levelTitle: levelInfo.title,
        nextLesson: lesson.next ? getLessonMeta(lesson.next) : null,
        topicProgress: { ...topicProgress, topicName: lesson.category },
        newlyUnlocked: [],
      },
      userUpdates: {},
      docUpdates: {},
    };
  }

  const unlocks = resolveUnlocksOnComplete(lesson.id, current);
  const streakUpdates = getStreakUserUpdates(user.lastActiveDate, user.streak ?? 0);
  const previousLevelInfo = getLevelInfo(current.xp);
  const xpBreakdown = attempt.templated ? null : calculateLessonXp(lesson.difficulty, attempt.score, streakUpdates.streak);
  const lessonXp = xpBreakdown?.totalXp ?? 0;
  const newXp = current.xp + lessonXp;
  const newLevelInfo = getLevelInfo(newXp);
  const recentlyCompleted = [lesson.id, ...current.recentlyCompleted.filter((id) => id !== lesson.id)].slice(0, 8);

  const nextCurrentLesson =
    lesson.next ??
    unlocks.newlyUnlocked.find((id) => Boolean(getLessonMeta(id))) ??
    unlocks.unlockedLessons.find((id) => !current.completedLessons.includes(id) && id !== lesson.id) ??
    null;

  const lastActiveDateStr = streakUpdates.lastActiveDate
    ? streakUpdates.lastActiveDate.toISOString().slice(0, 10)
    : current.lastActiveDate;

  const updatedLessonState: UserProgress = {
    ...current,
    completedLessons: [...current.completedLessons, lesson.id],
    unlockedLessons: unlocks.unlockedLessons,
    unlockedTiers: unlocks.unlockedTiers,
    unlockedTopics: unlocks.unlockedTopics,
    currentLesson: nextCurrentLesson,
    recentlyCompleted,
    xp: newXp,
    level: calculateLevel(newXp),
    streak: streakUpdates.streak,
    lastActiveDate: lastActiveDateStr,
  };

  const topicProgress = getTopicProgress(
    lesson.track,
    lesson.level,
    lesson.category,
    updatedLessonState.completedLessons
  );

  return {
    progress: { userId: String(user._id), ...updatedLessonState },
    result: {
      lesson,
      xpEarned: lessonXp,
      xpBreakdown,
      leveledUp: newLevelInfo.level > previousLevelInfo.level,
      previousLevel: previousLevelInfo.level,
      currentLevel: newLevelInfo.level,
      levelTitle: newLevelInfo.title,
      nextLesson: lesson.next ? getLessonMeta(lesson.next) : null,
      topicProgress: { ...topicProgress, topicName: lesson.category },
      newlyUnlocked: unlocks.newlyUnlocked,
    },
    userUpdates: {
      xp: newXp,
      currentLevel: calculateLevel(newXp),
      streak: streakUpdates.streak,
      ...(streakUpdates.lastActiveDate ? { lastActiveDate: streakUpdates.lastActiveDate } : {}),
    },
    docUpdates: {
      completedLessons: updatedLessonState.completedLessons,
      unlockedLessons: updatedLessonState.unlockedLessons,
      unlockedTiers: updatedLessonState.unlockedTiers,
      unlockedTopics: updatedLessonState.unlockedTopics,
      currentLesson: updatedLessonState.currentLesson,
      recentlyCompleted: updatedLessonState.recentlyCompleted,
    },
  };
}

