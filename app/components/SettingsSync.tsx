'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

export default function SettingsSync() {
  const { isAuthenticated, loading, user } = useAuth();
  const { loadSettings, resetSettings } = useSettings();
  const loadedForUserRef = useRef<string | null>(null);
  const userId = user?.id;

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && userId) {
      if (loadedForUserRef.current !== userId) {
        loadedForUserRef.current = userId;
        void loadSettings();
      }
    } else {
      loadedForUserRef.current = null;
      resetSettings();
    }
  }, [isAuthenticated, loading, userId, loadSettings, resetSettings]);

  return null;
}
