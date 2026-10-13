'use client';

import { use } from 'react';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import UniversalVisualizer from '@/app/components/visualizer/UniversalVisualizer';
import { findLessonByAlgorithmId, getLessonPath } from '@/app/data/curriculum';

interface PageProps {
  params: Promise<{ algorithmId: string }>;
}

export default function VisualizerPage({ params }: PageProps) {
  const { algorithmId } = use(params);
  const ctx = findLessonByAlgorithmId(algorithmId);
  const path = getLessonPath(algorithmId);

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
      : [{ label: path[path.length - 1] || algorithmId }]),
  ];

  return (
    <>
      <div className="flex-1">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1600px] flex-col gap-4 p-4 sm:p-6">
          <Breadcrumbs items={breadcrumbs} />
          <UniversalVisualizer algorithmId={algorithmId} />
        </div>
      </div>
    </>
  );
}
