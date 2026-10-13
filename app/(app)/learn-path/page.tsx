'use client';

import { Suspense } from 'react';
import LearningPathExplorer from '@/app/components/LearningPathExplorer';

function LearnPathContent() {
  return <LearningPathExplorer />;
}

export default function LearnPathPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      }
    >
      <LearnPathContent />
    </Suspense>
  );
}
