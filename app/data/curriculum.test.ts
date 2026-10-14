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
const MAX_GENERATED_THEORY = 247;
const MAX_TEMPLATED_QUIZZES = 75;

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
    expect(findLessonById('pat-ll-middle')?.track.id).toBe('patterns');
    expect(findLessonById('pat-nge')?.track.id).toBe('patterns');
    const shared = lessons.filter((l) => l.algorithmId === findLessonById('pat-ll-middle')!.lesson.algorithmId);
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
    ['pat-max-sum-k', 'array-max-sum-subarray-k', 'O(1)'],
    ['pat-averages', 'array-subarray-averages', 'O(n)'],
    ['pat-container', 'array-container-most-water', 'O(1)'],
    ['pat-happy', 'number-happy-fast-slow', 'O(1)'],
    ['pat-ll-palindrome', 'linked-list-palindrome', 'O(1)'],
    ['pat-cycle-start', 'linked-list-cycle-start', 'O(1)'],
    ['pat-find-dup', 'array-find-duplicate-number', 'O(1)'],
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

  /**
   * The same problem seen from a pattern angle: a Patterns lesson may reuse a
   * data-structure lesson's visualizer only when it is listed here.
   */
  const PATTERN_ANGLE_REUSE = [
    'array-reverse',
    'array-merge-sorted',
    'array-dutch-flag',
    'string-palindrome-check',
    'linked-list-middle',
    'linked-list-detect-cycle',
  ];

  it('teaches each algorithm once, apart from listed pattern-angle reuses', () => {
    const byAlgorithm = new Map<string, string[]>();
    for (const lesson of lessons) byAlgorithm.set(lesson.algorithmId, [...(byAlgorithm.get(lesson.algorithmId) ?? []), lesson.id]);
    const repeats = [...byAlgorithm].filter(([id, ids]) => ids.length > 1 && !PATTERN_ANGLE_REUSE.includes(id));
    expect(repeats).toEqual([]);
    for (const id of PATTERN_ANGLE_REUSE) {
      const tracksUsing = byAlgorithm.get(id)!.map((lessonId) => findLessonById(lessonId)!.track.id).sort();
      expect(tracksUsing, id).toEqual(['data-structures', 'patterns']);
    }
  });

  it.each([
    ['ll-create', 'data-structures', 'Beginner', 'linked-list'],
    ['graph-bfs', 'data-structures', 'Intermediate', 'graph'],
    ['ga-dijkstra', 'algorithms', 'Advanced', 'graph-algorithms'],
    ['bit-aox', 'algorithms', 'Intermediate', 'bit-algorithms'],
    ['bit-tsp', 'algorithms', 'Advanced', 'dynamic-programming'],
    ['bt-cameras', 'algorithms', 'Advanced', 'dynamic-programming'],
    ['string-kmp', 'algorithms', 'Advanced', 'string-algorithms'],
    ['search-median', 'algorithms', 'Advanced', 'advanced-searching'],
    ['pat-ll-middle', 'patterns', 'Beginner', 'fast-slow-pointer'],
    ['pat-sw-max', 'patterns', 'Beginner', 'sliding-window'],
    ['queue-monotonic', 'patterns', 'Beginner', 'sliding-window'],
    ['queue-task-sched', 'data-structures', 'Intermediate', 'heap'],
    ['hashmap-lfu', 'data-structures', 'Beginner', 'linked-list'],
  ])('files %s under %s › %s › %s', (lessonId, trackId, level, topicId) => {
    const ctx = findLessonById(lessonId);
    expect([ctx?.track.id, ctx?.level, ctx?.topic.id]).toEqual([trackId, level, topicId]);
  });

  it('does not add generated lesson content (ratchet; spec B7/F2)', () => {
    const generatedTheory = lessons.filter((l) => !hasAuthoredTheory(l.algorithmId)).length;
    const templatedQuizzes = lessons.filter((l) => getLessonQuiz(l.id)?.templated).length;
    expect(generatedTheory).toBeLessThanOrEqual(MAX_GENERATED_THEORY);
    expect(templatedQuizzes).toBeLessThanOrEqual(MAX_TEMPLATED_QUIZZES);
  });
});
