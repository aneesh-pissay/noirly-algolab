import { describe, expect, it } from 'vitest';
import { tracks, type Level } from '@/app/data/curriculum';
import type { UserProgress } from '@/src/features/progress/progress.types';
import {
  CORE_DIFFICULTIES,
  getInitialProgress,
  getStageCoreLessons,
  getStageProgress,
  isStageUnlocked,
  reconcileUnlocks,
  resolveUnlocksOnComplete,
} from '@/src/features/progress/progress.utils';

/** Completes lessons in order, the way /api/progress/complete does. */
function complete(state: UserProgress, ids: string[]): UserProgress {
  for (const id of ids) {
    expect(state.unlockedLessons, `${id} should be unlocked before it is completed`).toContain(id);
    const unlocks = resolveUnlocksOnComplete(id, state);
    state = { ...state, completedLessons: [...state.completedLessons, id], ...unlocks };
  }
  return state;
}

const firstLessonOf = (trackId: string, level: Level, topicIndex = 0) => {
  const topic = tracks.find((t) => t.id === trackId)!.topics[level][topicIndex];
  return topic.lessons.Easy[0].id;
};

/** Every track's core for a level, in the order a learner can reach it. */
function stageInOrder(level: Level): string[] {
  return tracks.flatMap((t) => t.topics[level].flatMap((topic) => CORE_DIFFICULTIES.flatMap((d) => topic.lessons[d].map((l) => l.id))));
}

describe('staged learning path', () => {
  it('starts every track at its first Beginner lesson', () => {
    expect(getInitialProgress().unlockedLessons).toEqual(tracks.map((t) => firstLessonOf(t.id, 'Beginner')));
  });

  it('opens the next topic once a topic’s Easy and Medium lessons are done, leaving Hard as a challenge', () => {
    const arrays = tracks[0].topics.Beginner[0];
    const core = [...arrays.lessons.Easy, ...arrays.lessons.Medium].map((l) => l.id);
    const state = complete(getInitialProgress(), core);
    expect(state.unlockedLessons).toContain(firstLessonOf('data-structures', 'Beginner', 1));
    expect(state.unlockedLessons).toContain(arrays.lessons.Hard[0].id);
  });

  it('keeps Intermediate closed until the Beginner core of every track is done', () => {
    const dsOnly = stageInOrder('Beginner').filter((id) => tracks[0].topics.Beginner.some((t) => Object.values(t.lessons).flat().some((l) => l.id === id)));
    let state = complete(getInitialProgress(), dsOnly);
    expect(state.unlockedLessons).not.toContain(firstLessonOf('data-structures', 'Intermediate'));
    expect(isStageUnlocked('Intermediate', state)).toBe(false);

    state = complete(state, stageInOrder('Beginner').filter((id) => !state.completedLessons.includes(id)));
    expect(getStageProgress('Beginner', state.completedLessons)).toEqual({ done: getStageCoreLessons('Beginner').length, total: getStageCoreLessons('Beginner').length });
    for (const track of tracks) expect(state.unlockedLessons).toContain(firstLessonOf(track.id, 'Intermediate'));
    expect(state.unlockedLessons).not.toContain(firstLessonOf('data-structures', 'Advanced'));
    expect(isStageUnlocked('Intermediate', state)).toBe(true);
    expect(isStageUnlocked('Advanced', state)).toBe(false);
  });

  it('opens Advanced after the Intermediate core of every track', () => {
    const state = complete(getInitialProgress(), [...stageInOrder('Beginner'), ...stageInOrder('Intermediate')]);
    for (const track of tracks) expect(state.unlockedLessons).toContain(firstLessonOf(track.id, 'Advanced'));
  });

  it('gives existing learners what the new rules open, without a migration', () => {
    // Saved under the old rule: Arrays core done, but Strings stayed locked until Arrays' Hard tier.
    const arrays = tracks[0].topics.Beginner[0];
    const done = [...arrays.lessons.Easy, ...arrays.lessons.Medium].map((l) => l.id);
    const legacy: UserProgress = { ...getInitialProgress(), completedLessons: done, unlockedLessons: [...getInitialProgress().unlockedLessons, ...done] };
    expect(legacy.unlockedLessons).not.toContain(firstLessonOf('data-structures', 'Beginner', 1));
    expect(reconcileUnlocks(legacy).unlockedLessons).toContain(firstLessonOf('data-structures', 'Beginner', 1));
  });
});
