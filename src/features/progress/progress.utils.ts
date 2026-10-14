import {
  tracks,
  levels,
  difficulties,
  type Track,
  type Topic,
  type Lesson,
  type Level,
  type TrackId,
} from '@/app/data/curriculum';
import {
  XP_BY_DIFFICULTY,
  type LessonMeta,
  type LessonStatusType,
  type UserProgress,
} from './progress.types';
import {
  calculateLevelFromXp,
  getLevelInfo,
  xpToNextLevel as gamificationXpToNextLevel,
} from '@/lib/gamification';

export const LESSON_REGISTRY: Record<string, LessonMeta> = {};
export const LESSON_BY_ALGORITHM: Record<string, string> = {};

function tierKey(trackId: TrackId, level: Level, topicId: string, difficulty: string): string {
  return `${trackId}:${level}:${topicId}:${difficulty}`;
}

function topicKey(trackId: TrackId, level: Level, topicId: string): string {
  return `${trackId}:${level}:${topicId}`;
}

function levelKey(trackId: TrackId, level: Level): string {
  return `${trackId}:${level}`;
}

function flattenTopicLessons(topic: Topic): Lesson[] {
  return difficulties.flatMap((d) => topic.lessons[d] ?? []);
}

function buildRegistry(): void {
  if (Object.keys(LESSON_REGISTRY).length > 0) return;

  for (const track of tracks) {
    for (const level of levels) {
      const topicList = track.topics[level] ?? [];

      topicList.forEach((topic, topicIndex) => {
        const flat = flattenTopicLessons(topic);

        flat.forEach((lesson, lessonIndex) => {
          const next = flat[lessonIndex + 1]?.id ?? null;
          const prev = flat[lessonIndex - 1]?.id ?? null;

          LESSON_REGISTRY[lesson.id] = {
            id: lesson.id,
            title: lesson.name,
            algorithmId: lesson.algorithmId,
            track: track.id,
            category: topic.id,
            level,
            difficulty: lesson.difficulty,
            time: lesson.time,
            space: lesson.space,
            xp: XP_BY_DIFFICULTY[lesson.difficulty],
            next,
            prev,
          };

          // First lesson wins, matching findLessonByAlgorithmId (several
          // tracks reuse an algorithm; lookups by lesson id are exact).
          LESSON_BY_ALGORITHM[lesson.algorithmId] ??= lesson.id;
        });
      });
    }
  }
}

buildRegistry();

export function getLessonMeta(lessonId: string): LessonMeta | null {
  return LESSON_REGISTRY[lessonId] ?? null;
}

export function getLessonByAlgorithmId(algorithmId: string): LessonMeta | null {
  const lessonId = LESSON_BY_ALGORITHM[algorithmId];
  return lessonId ? getLessonMeta(lessonId) : null;
}

/** Resolves by lesson id or algorithm registry id */
export function getLessonById(lessonId: string): LessonMeta | null {
  return getLessonMeta(lessonId) ?? getLessonByAlgorithmId(lessonId);
}

export function getLessonXp(lesson: LessonMeta): number {
  return typeof lesson.xp === 'number' && lesson.xp > 0 ? lesson.xp : 50;
}

export function getAllLessonMetas(): LessonMeta[] {
  return Object.values(LESSON_REGISTRY);
}

export function calculateLevel(xp: number): number {
  return calculateLevelFromXp(xp);
}

export { getLevelInfo, gamificationXpToNextLevel as xpToNextLevel };

export function normalizeProgressState(partial: Partial<UserProgress>): UserProgress {
  const defaults = getInitialProgress();
  const xp = Number.isFinite(partial.xp) ? (partial.xp as number) : 0;
  return {
    completedLessons: partial.completedLessons ?? defaults.completedLessons,
    unlockedLessons: partial.unlockedLessons ?? defaults.unlockedLessons,
    unlockedTiers: partial.unlockedTiers ?? defaults.unlockedTiers,
    unlockedTopics: partial.unlockedTopics ?? defaults.unlockedTopics,
    currentLesson: partial.currentLesson ?? defaults.currentLesson,
    xp,
    level: Number.isFinite(partial.level) ? (partial.level as number) : calculateLevel(xp),
    streak: Number.isFinite(partial.streak) ? (partial.streak as number) : 0,
    lastActiveDate: partial.lastActiveDate ?? null,
    recentlyCompleted: partial.recentlyCompleted ?? defaults.recentlyCompleted,
  };
}

export function getInitialProgress(): UserProgress {
  const starterLessons = tracks
    .map((track) => {
      const firstTopic = track.topics.Beginner?.[0];
      if (!firstTopic) return null;
      const firstLesson = flattenTopicLessons(firstTopic)[0];
      return firstLesson?.id ?? null;
    })
    .filter((id): id is string => Boolean(id));

  return {
    completedLessons: [],
    unlockedLessons: [...new Set(starterLessons)],
    unlockedTiers: starterLessons.map((id) => {
      const meta = getLessonMeta(id);
      return meta ? tierKey(meta.track, meta.level, meta.category, meta.difficulty) : '';
    }).filter(Boolean),
    unlockedTopics: starterLessons.map((id) => {
      const meta = getLessonMeta(id);
      return meta ? topicKey(meta.track, meta.level, meta.category) : '';
    }).filter(Boolean),
    currentLesson: starterLessons[0] ?? null,
    xp: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    recentlyCompleted: [],
  };
}

export function getLessonStatus(lessonId: string, progress: UserProgress): LessonStatusType {
  if (progress.completedLessons.includes(lessonId)) return 'completed';
  if (progress.currentLesson === lessonId) return 'current';
  if (progress.unlockedLessons.includes(lessonId)) return 'available';
  return 'locked';
}

export function isDifficultyUnlocked(
  trackId: TrackId,
  level: Level,
  topicId: string,
  difficulty: string,
  progress: UserProgress
): boolean {
  return progress.unlockedTiers.includes(tierKey(trackId, level, topicId, difficulty));
}

export function isTopicUnlocked(trackId: TrackId, level: Level, topicId: string, progress: UserProgress): boolean {
  return progress.unlockedTopics.includes(topicKey(trackId, level, topicId));
}

export function isLevelUnlocked(trackId: TrackId, level: Level, progress: UserProgress): boolean {
  if (level === 'Beginner') return true;
  return progress.unlockedTopics.some((key) => key.startsWith(`${trackId}:${level}:`));
}

function getTopicLessons(track: Track, level: Level, topicId: string): LessonMeta[] {
  const topic = track.topics[level]?.find((t) => t.id === topicId);
  if (!topic) return [];
  return flattenTopicLessons(topic)
    .map((l) => getLessonMeta(l.id))
    .filter((m): m is LessonMeta => Boolean(m));
}

function getNextTopicFirstLesson(track: Track, level: Level, topicId: string): LessonMeta | null {
  const topicList = track.topics[level] ?? [];
  const idx = topicList.findIndex((t) => t.id === topicId);
  if (idx < 0 || idx >= topicList.length - 1) return null;
  const nextTopic = topicList[idx + 1];
  const first = flattenTopicLessons(nextTopic)[0];
  return first ? getLessonMeta(first.id) : null;
}

function getNextLevelFirstLesson(track: Track, currentLevel: Level): LessonMeta | null {
  const levelIdx = levels.indexOf(currentLevel);
  if (levelIdx < 0 || levelIdx >= levels.length - 1) return null;
  const nextLevel = levels[levelIdx + 1];
  const firstTopic = track.topics[nextLevel]?.[0];
  if (!firstTopic) return null;
  const first = flattenTopicLessons(firstTopic)[0];
  return first ? getLessonMeta(first.id) : null;
}

/**
 * A topic's core: its Easy and Medium lessons. Finishing the core opens the
 * next topic; the Hard tier stays open as a challenge. Several Beginner
 * topics end in advanced problems (LFU Cache, Reverse K Group, Find Duplicate), so
 * requiring them before the next topic or stage would block the path.
 */
export const CORE_DIFFICULTIES = ['Easy', 'Medium'] as const;

function topicCoreLessons(topic: Topic): Lesson[] {
  return CORE_DIFFICULTIES.flatMap((d) => topic.lessons[d] ?? []);
}

function isTopicCoreComplete(track: Track, level: Level, topicId: string, completed: string[]): boolean {
  const topic = track.topics[level]?.find((t) => t.id === topicId);
  const lessons = topic ? topicCoreLessons(topic) : [];
  return lessons.length > 0 && lessons.every((l) => completed.includes(l.id));
}

/** Core lessons of one level across every track (a "stage" of the path). */
export function getStageCoreLessons(level: Level): Lesson[] {
  return tracks.flatMap((track) => (track.topics[level] ?? []).flatMap(topicCoreLessons));
}

export function getStageProgress(level: Level, completedLessons: string[]): { done: number; total: number } {
  const done = new Set(completedLessons);
  const lessons = getStageCoreLessons(level);
  return { done: lessons.filter((l) => done.has(l.id)).length, total: lessons.length };
}

function isStageCoreComplete(level: Level, completed: string[]): boolean {
  const { done, total } = getStageProgress(level, completed);
  return total > 0 && done === total;
}

/**
 * The path is staged: every track's Beginner core comes before any
 * Intermediate topic, and every Intermediate core before Advanced.
 * Learners who unlocked a later level under the old per-track rule keep it.
 */
export function isStageUnlocked(level: Level, progress: Pick<UserProgress, 'completedLessons' | 'unlockedTopics'>): boolean {
  const index = levels.indexOf(level);
  if (index <= 0) return true;
  return (
    isStageCoreComplete(levels[index - 1], progress.completedLessons) ||
    progress.unlockedTopics.some((key) => key.split(':')[1] === level)
  );
}

function isDifficultyComplete(
  track: Track,
  level: Level,
  topicId: string,
  difficulty: string,
  completed: string[]
): boolean {
  const topic = track.topics[level]?.find((t) => t.id === topicId);
  if (!topic) return false;
  const lessons = (topic.lessons as Record<string, Lesson[]>)[difficulty] ?? [];
  return lessons.length > 0 && lessons.every((l) => completed.includes(l.id));
}


export function resolveUnlocksOnComplete(
  lessonId: string,
  progress: UserProgress
): { unlockedLessons: string[]; unlockedTiers: string[]; unlockedTopics: string[]; newlyUnlocked: string[] } {
  const meta = getLessonMeta(lessonId);
  if (!meta) {
    return {
      unlockedLessons: progress.unlockedLessons,
      unlockedTiers: progress.unlockedTiers,
      unlockedTopics: progress.unlockedTopics,
      newlyUnlocked: [],
    };
  }

  const track = tracks.find((t) => t.id === meta.track)!;
  const completed = [...progress.completedLessons, lessonId];
  const unlockedLessons = new Set(progress.unlockedLessons);
  const unlockedTiers = new Set(progress.unlockedTiers);
  const unlockedTopics = new Set(progress.unlockedTopics);
  const newlyUnlocked: string[] = [];

  const addLesson = (id: string | null) => {
    if (!id || unlockedLessons.has(id) || completed.includes(id)) return;
    unlockedLessons.add(id);
    newlyUnlocked.push(id);
    const m = getLessonMeta(id);
    if (m) {
      unlockedTiers.add(tierKey(m.track, m.level, m.category, m.difficulty));
      unlockedTopics.add(topicKey(m.track, m.level, m.category));
    }
  };

  addLesson(meta.next);

  if (isDifficultyComplete(track, meta.level, meta.category, meta.difficulty, completed)) {
    const diffIdx = difficulties.indexOf(meta.difficulty);
    if (diffIdx >= 0 && diffIdx < difficulties.length - 1) {
      const nextDiff = difficulties[diffIdx + 1];
      const tier = tierKey(meta.track, meta.level, meta.category, nextDiff);
      if (!unlockedTiers.has(tier)) {
        unlockedTiers.add(tier);
        newlyUnlocked.push(tier);
      }
      const topic = track.topics[meta.level]?.find((t) => t.id === meta.category);
      const firstInTier = topic?.lessons[nextDiff]?.[0];
      if (firstInTier) addLesson(firstInTier.id);
    }
  }

  if (isTopicCoreComplete(track, meta.level, meta.category, completed)) {
    addLesson(getNextTopicFirstLesson(track, meta.level, meta.category)?.id ?? null);
  }

  // Finishing a stage's core in every track opens the next level of every track.
  if (isStageCoreComplete(meta.level, completed)) {
    for (const t of tracks) addLesson(getNextLevelFirstLesson(t, meta.level)?.id ?? null);
  }

  return {
    unlockedLessons: [...unlockedLessons],
    unlockedTiers: [...unlockedTiers],
    unlockedTopics: [...unlockedTopics],
    newlyUnlocked,
  };
}

/**
 * Re-applies the unlock rules to everything already completed, so a change
 * to the rules reaches existing learners without a migration. Only ever adds
 * unlocks.
 */
export function reconcileUnlocks<T extends UserProgress>(progress: T): T {
  let state: T = withCurrentLessonKeys(progress);
  for (const id of progress.completedLessons) {
    const unlocks = resolveUnlocksOnComplete(id, state);
    if (unlocks.newlyUnlocked.length === 0) continue;
    state = {
      ...state,
      unlockedLessons: unlocks.unlockedLessons,
      unlockedTiers: unlocks.unlockedTiers,
      unlockedTopics: unlocks.unlockedTopics,
    };
  }
  return state;
}

/**
 * Tier and topic keys include the level, so moving a topic or lesson to
 * another level leaves saved keys pointing at the old place. Re-derive them
 * from the lessons already open, but only in stages the learner has reached,
 * so a lesson moved to a later level (KMP → Advanced) does not open that stage.
 */
function withCurrentLessonKeys<T extends UserProgress>(progress: T): T {
  const unlockedTiers = new Set(progress.unlockedTiers);
  const unlockedTopics = new Set(progress.unlockedTopics);
  const reached = new Map(levels.map((level) => [level, isStageUnlocked(level, progress)]));
  for (const id of new Set([...progress.unlockedLessons, ...progress.completedLessons])) {
    const m = getLessonMeta(id);
    if (!m || !reached.get(m.level)) continue;
    unlockedTiers.add(tierKey(m.track, m.level, m.category, m.difficulty));
    unlockedTopics.add(topicKey(m.track, m.level, m.category));
  }
  if (unlockedTiers.size === progress.unlockedTiers.length && unlockedTopics.size === progress.unlockedTopics.length) return progress;
  return { ...progress, unlockedTiers: [...unlockedTiers], unlockedTopics: [...unlockedTopics] };
}

export function updateStreak(lastActiveDate: string | null, streak: number): { streak: number; lastActiveDate: string } {
  const today = new Date().toISOString().slice(0, 10);
  if (lastActiveDate === today) return { streak, lastActiveDate: today };

  if (!lastActiveDate) return { streak: 1, lastActiveDate: today };

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (lastActiveDate === yesterdayStr) return { streak: streak + 1, lastActiveDate: today };
  return { streak: 1, lastActiveDate: today };
}

export function getTopicProgress(
  trackId: TrackId,
  level: Level,
  topicId: string,
  completedLessons: string[]
): { completed: number; total: number } {
  const track = tracks.find((t) => t.id === trackId);
  if (!track) return { completed: 0, total: 0 };
  const lessons = getTopicLessons(track, level, topicId);
  const completed = lessons.filter((l) => completedLessons.includes(l.id)).length;
  return { completed, total: lessons.length };
}

export function getContinueLesson(progress: UserProgress): LessonMeta | null {
  if (progress.currentLesson) {
    const current = getLessonMeta(progress.currentLesson);
    if (current && !progress.completedLessons.includes(current.id)) return current;
  }

  const available = progress.unlockedLessons.find(
    (id) => !progress.completedLessons.includes(id)
  );
  if (available) return getLessonMeta(available);

  return getLessonMeta(progress.unlockedLessons[0] ?? '') ?? null;
}
