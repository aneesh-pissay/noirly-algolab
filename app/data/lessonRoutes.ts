/** URL of a lesson page. Lessons are routed by lesson id (spec B6). */
export function lessonHref(lessonId: string): string {
  return `/visualizer/${encodeURIComponent(lessonId)}`;
}
