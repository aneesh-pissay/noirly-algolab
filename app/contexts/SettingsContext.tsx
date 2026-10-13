'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { applyAppearance, resolveTheme } from '@/lib/apply-appearance';
import {
  DEFAULT_CLIENT_SETTINGS,
  type ClientSettings,
  type ClientSettingsPatch,
  type CodeLanguage,
  type EmailNotifications,
  type FontSize,
  type ProfileVisibility,
  type ThemeMode,
} from '@/lib/settings.types';
import * as settingsAPI from '@/src/services/settings.service';
import { useSession } from 'next-auth/react';

export type { ThemeMode, CodeLanguage, FontSize, ProfileVisibility, EmailNotifications };

interface SettingsContextValue extends ClientSettings {
  loading: boolean;
  saving: boolean;
  isReady: boolean;
  error: string | null;
  resolvedTheme: 'dark' | 'light';
  loadSettings: () => Promise<void>;
  resetSettings: () => void;
  updateSettings: (patch: ClientSettingsPatch) => void;
  toggleTheme: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ClientSettings>(DEFAULT_CLIENT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('dark');

  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const loadSeqRef = useRef(0);
  const saveSeqRef = useRef(0);
  // Signed-out visitors keep settings in memory only (nothing to save to).
  const { status } = useSession();
  const signedInRef = useRef(false);
  useEffect(() => {
    signedInRef.current = status === 'authenticated';
  }, [status]);

  useEffect(() => {
    applyAppearance(settings);
    setResolvedTheme(resolveTheme(settings.theme));
  }, [settings]);

  useEffect(() => {
    if (settings.theme !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      applyAppearance(settingsRef.current);
      setResolvedTheme(resolveTheme('auto'));
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [settings.theme]);

  const resetSettings = useCallback(() => {
    loadSeqRef.current += 1;
    saveSeqRef.current += 1;
    setSettings(DEFAULT_CLIENT_SETTINGS);
    setLoading(false);
    setSaving(false);
    setIsReady(true);
    setError(null);
    applyAppearance(DEFAULT_CLIENT_SETTINGS);
  }, []);

  const loadSettings = useCallback(async () => {
    if (!signedInRef.current) {
      resetSettings();
      return;
    }

    const seq = ++loadSeqRef.current;
    setLoading(true);
    setError(null);

    try {
      const data = await settingsAPI.getUserSettings();
      if (seq !== loadSeqRef.current || saveSeqRef.current > 0) return;
      setSettings(data);
      setError(null);
    } catch (err) {
      if (seq !== loadSeqRef.current) return;
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      if (seq === loadSeqRef.current) {
        setLoading(false);
        setIsReady(true);
      }
    }
  }, [resetSettings]);

  const updateSettings = useCallback((patch: ClientSettingsPatch) => {
    const previous = settingsRef.current;
    const next: ClientSettings = {
      ...previous,
      ...patch,
      emailNotifications: patch.emailNotifications
        ? { ...previous.emailNotifications, ...patch.emailNotifications }
        : previous.emailNotifications,
    };

    const saveSeq = ++saveSeqRef.current;
    setSettings(next);
    setSaving(true);
    setError(null);

    if (!signedInRef.current) {
      saveSeqRef.current = 0;
      setSaving(false);
      return;
    }

    void (async () => {
      try {
        const saved = await settingsAPI.updateUserSettings(patch);
        if (saveSeq === saveSeqRef.current) {
          setSettings(saved);
          setError(null);
        }
      } catch (err) {
        if (saveSeq === saveSeqRef.current) {
          setSettings(previous);
          applyAppearance(previous);
          setError(err instanceof Error ? err.message : 'Failed to save settings');
        }
      } finally {
        if (saveSeq === saveSeqRef.current) {
          saveSeqRef.current = 0;
          setSaving(false);
        }
      }
    })();
  }, []);

  const toggleTheme = useCallback(() => {
    const current = resolveTheme(settingsRef.current.theme);
    updateSettings({ theme: current === 'dark' ? 'light' : 'dark' });
  }, [updateSettings]);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        loading,
        saving,
        isReady,
        error,
        resolvedTheme,
        loadSettings,
        resetSettings,
        updateSettings,
        toggleTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
