import type { Algorithm } from '@/src/core/engine/types';
import { findLessonById } from './curriculum';
import { getTopicTheory } from './curriculumTheory';
import { algorithmTheory, type AlgorithmTheory } from './algorithmTheory';

export type { AlgorithmTheory as LessonTheory };

/** algorithmTheory is keyed by the Visual Lab slug for a few lessons. */
export const THEORY_ALIASES: Record<string, string> = {
  'sorting-bubble': 'bubble-sort',
  'array-reverse': 'reverse-array',
  'array-two-sum': 'two-sum',
  'queue-sliding-window-maximum': 'sliding-window-max',
  'string-palindrome-check': 'palindrome-check',
};

export function resolveTheoryKey(algorithmId: string): string {
  return THEORY_ALIASES[algorithmId] ?? algorithmId;
}

/** True when the lesson has hand-written theory rather than the generated outline. */
export function hasAuthoredTheory(algorithmId: string): boolean {
  return Boolean(algorithmTheory[resolveTheoryKey(algorithmId)] ?? algorithmTheory[algorithmId]);
}

function buildTheoryFromAlgorithm(lessonId: string, algorithmId: string, algorithm: Algorithm, lessonName?: string): AlgorithmTheory {
  const ctx = findLessonById(lessonId);
  const topicTheory = ctx ? getTopicTheory(ctx.topic.id, ctx.topic.name, ctx.topic.description) : null;
  const displayName = lessonName ?? algorithm.name;
  const time = ctx?.lesson.time ?? algorithm.complexity.time;
  const space = ctx?.lesson.space ?? algorithm.complexity.space;

  return {
    id: algorithmId,
    overview: `${displayName}: ${algorithm.description} ${topicTheory?.overview ?? ''}`.trim(),
    howItWorks: [
      `Initialize the input and set up any pointers, indices, or auxiliary structures needed for ${displayName}.`,
      'Process each step shown in the visualizer — watch how data changes at every operation.',
      `Apply the core logic: ${algorithm.description.toLowerCase()}`,
      `Track time complexity ${time} and space complexity ${space} as you follow along.`,
      'Verify the final state matches the expected output before moving to the quiz.',
    ],
    keyPoints: [`Time complexity: ${time}`, `Space complexity: ${space}`, `Category: ${algorithm.category}`, ...(topicTheory?.keyConcepts.slice(0, 2) ?? [])],
    useCases: topicTheory?.realWorld ?? [
      'Technical interviews and coding assessments',
      'Competitive programming problems',
      'Production systems requiring efficient data processing',
      'Building foundational DSA intuition',
    ],
    pros: [
      'Builds step-by-step understanding through visualization',
      `Efficient approach with ${time} time complexity`,
      'Reusable pattern for similar problems in the same category',
    ],
    cons: [
      'Edge cases require careful boundary checking',
      'Performance depends on input size and data distribution',
      'May need adaptation for variations of the core problem',
    ],
  };
}

export function getLessonTheory(lessonId: string, algorithm?: Algorithm | null, lessonName?: string): AlgorithmTheory {
  const ctx = findLessonById(lessonId);
  const algorithmId = ctx?.lesson.algorithmId ?? lessonId;
  const authored = algorithmTheory[resolveTheoryKey(algorithmId)] ?? algorithmTheory[algorithmId];
  if (authored) return { ...authored, id: algorithmId };
  if (algorithm) return buildTheoryFromAlgorithm(lessonId, algorithmId, algorithm, lessonName);

  const topicTheory = ctx ? getTopicTheory(ctx.topic.id, ctx.topic.name, ctx.topic.description) : null;
  return {
    id: algorithmId,
    overview: topicTheory?.overview ?? `Learn ${lessonName ?? algorithmId} through interactive visualization and assessment.`,
    howItWorks: [
      'Study the theory overview to understand the problem and approach.',
      'Watch the step-by-step visualizer to see each operation in action.',
      'Follow the code panel to connect logic with execution.',
      'Pass the quiz to confirm your understanding before marking complete.',
    ],
    keyPoints: topicTheory?.keyConcepts ?? ['Core operations', 'Complexity analysis', 'Edge cases', 'Pattern recognition'],
    useCases: topicTheory?.realWorld ?? ['Interview preparation', 'Algorithm study', 'Problem-solving practice'],
    pros: ['Visual learning reinforces memory', 'Self-paced progression', 'Immediate feedback via quiz'],
    cons: ['Requires active engagement', 'Practice needed for mastery', 'Variations may need extra study'],
  };
}
