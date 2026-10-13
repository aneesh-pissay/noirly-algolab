import { describe, expect, it } from 'vitest';
import { findLessonById, getAllLessons, tracks, levels, difficulties } from '@/app/data/curriculum';
import { getRegisteredAlgorithmIds } from '@/app/lib/engineBootstrap';
import { hasAuthoredTheory } from '@/app/data/lessonTheory';
import { getLessonQuiz } from '@/src/server/quiz/bank';

const lessons = getAllLessons();

/**
 * Lessons still on generated theory / templated quizzes (spec B7, F2). The
 * count may only go down: lower these numbers when authoring content, and
 * the test fails if a change adds more generated lessons.
 */
const MAX_GENERATED_THEORY = 315;
const MAX_TEMPLATED_QUIZZES = 316;

describe('curriculum', () => {
  it('has unique lesson ids', () => {
    const seen = new Set<string>();
    const duplicates = lessons.filter((lesson) => {
      if (seen.has(lesson.id)) return true;
      seen.add(lesson.id);
      return false;
    });
    expect(duplicates.map((lesson) => lesson.id)).toEqual([]);
  });

  it('points every lesson at a registered algorithm', () => {
    const registered = new Set(getRegisteredAlgorithmIds());
    const missing = lessons.filter((lesson) => !registered.has(lesson.algorithmId));
    expect(missing.map((lesson) => `${lesson.id} -> ${lesson.algorithmId}`)).toEqual([]);
  });

  it('files every lesson under the difficulty it declares', () => {
    const misfiled: string[] = [];
    for (const track of tracks)
      for (const level of levels)
        for (const topic of track.topics[level] ?? [])
          for (const difficulty of difficulties)
            for (const lesson of topic.lessons[difficulty] ?? []) if (lesson.difficulty !== difficulty) misfiled.push(lesson.id);
    expect(misfiled).toEqual([]);
  });

  it('resolves lessons that share an algorithm to their own track (B6)', () => {
    expect(findLessonById('pat-bfs')?.track.id).toBe('patterns');
    expect(findLessonById('pat-dijkstra')?.track.id).toBe('patterns');
    const shared = lessons.filter((l) => l.algorithmId === findLessonById('pat-bfs')!.lesson.algorithmId);
    expect(shared.length).toBeGreaterThan(1);
    expect(new Set(shared.map((l) => findLessonById(l.id)!.track.id)).size).toBe(shared.length);
  });

  it.each([
    ['pat-two-sum', 'array-two-sum-sorted', 'O(1)'],
    ['pat-three-sum', 'array-three-sum', 'O(1)'],
    ['pat-remove-dup', 'array-remove-duplicates-sorted', 'O(1)'],
    ['pat-longest-unique', 'string-longest-unique-substring', 'O(k)'],
    ['pat-anagrams', 'string-count-anagrams', 'O(1)'],
    ['pat-sw-median', 'heap-sliding-window-median', 'O(k)'],
  ])('maps %s to its own visualizer (B6)', (lessonId, algorithmId, space) => {
    const ctx = findLessonById(lessonId);
    expect(ctx?.lesson.algorithmId).toBe(algorithmId);
    expect(ctx?.lesson.space).toBe(space);
  });

  it('no longer files Task Scheduler under Sliding Window (B6)', () => {
    const window = tracks.find((t) => t.id === 'patterns')!.topics.Beginner.find((t) => t.id === 'sliding-window')!;
    const ids = difficulties.flatMap((d) => window.lessons[d].map((l) => l.algorithmId));
    expect(ids).not.toContain('queue-task-scheduler');
  });

  it('does not add generated lesson content (ratchet; spec B7/F2)', () => {
    const generatedTheory = lessons.filter((l) => !hasAuthoredTheory(l.algorithmId)).length;
    const templatedQuizzes = lessons.filter((l) => getLessonQuiz(l.id)?.templated).length;
    expect(generatedTheory).toBeLessThanOrEqual(MAX_GENERATED_THEORY);
    expect(templatedQuizzes).toBeLessThanOrEqual(MAX_TEMPLATED_QUIZZES);
  });
});
