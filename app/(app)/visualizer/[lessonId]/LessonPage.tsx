'use client';

import Breadcrumbs from '@/app/components/Breadcrumbs';
import UniversalVisualizer from '@/app/components/visualizer/UniversalVisualizer';
import { findLessonById } from '@/app/data/curriculum';

export default function LessonPage({ lessonId }: { lessonId: string }) {
  const ctx = findLessonById(lessonId);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Learning Path', href: '/learn-path' },
    ...(ctx
      ? [
          { label: ctx.track.title, href: `/learn-path?track=${ctx.track.id}` },
          { label: ctx.level, href: `/learn-path?track=${ctx.track.id}&level=${ctx.level}` },
          { label: ctx.topic.name, href: `/learn-path?track=${ctx.track.id}&level=${ctx.level}&topic=${ctx.topic.id}` },
          { label: ctx.lesson.name },
        ]
      : [{ label: lessonId }]),
  ];

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 p-4 sm:p-6">
      <Breadcrumbs items={breadcrumbs} />
      {/* Keyed so moving between lessons starts each one fresh. */}
      <UniversalVisualizer key={lessonId} lessonId={lessonId} />
    </div>
  );
}
