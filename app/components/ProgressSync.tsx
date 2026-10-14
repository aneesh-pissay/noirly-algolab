'use client';

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useProgressStore } from '@/src/features/progress';

export default function ProgressSync() {
  const { isAuthenticated, loading } = useAuth();
  const loadProgress = useProgressStore((s) => s.loadProgress);
  const reset = useProgressStore((s) => s.reset);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      void loadProgress();
    } else {
      reset();
    }
  }, [isAuthenticated, loading, loadProgress, reset]);

  return null;
}
