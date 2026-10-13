import { getLessonMeta } from '@/src/features/progress/progress.utils';

/** URL of a lesson page. */
export function lessonHref(lessonId: string): string {
  const meta = getLessonMeta(lessonId);
  return `/visualizer/${meta?.algorithmId ?? lessonId}`;
}
