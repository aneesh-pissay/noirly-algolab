import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { findLessonByAlgorithmId, findLessonById } from '@/app/data/curriculum';
import { lessonHref } from '@/app/data/lessonRoutes';
import LessonPage from './LessonPage';

interface PageProps {
  params: Promise<{ lessonId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const ctx = findLessonById(decodeURIComponent(lessonId));
  return { title: ctx ? `${ctx.lesson.name} · ${ctx.topic.name} · Noirly AlgoLab` : 'Lesson · Noirly AlgoLab' };
}

export default async function VisualizerPage({ params, searchParams }: PageProps) {
  const lessonId = decodeURIComponent((await params).lessonId);
  if (findLessonById(lessonId)) return <LessonPage lessonId={lessonId} />;

  // Old links used the algorithm id; send them to the (first) lesson using it.
  const legacy = findLessonByAlgorithmId(lessonId);
  if (legacy) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(await searchParams)) {
      if (typeof value === 'string') query.set(key, value);
    }
    const suffix = query.size ? `?${query}` : '';
    permanentRedirect(`${lessonHref(legacy.lesson.id)}${suffix}`);
  }
  notFound();
}
