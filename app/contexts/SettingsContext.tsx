'use client';

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { applyAppearance, readStoredTheme, resolveTheme } from '@/lib/apply-appearance';
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
import { trackSave } from '@/src/stores/saving';

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

const SYSTEM_DARK = '(prefers-color-scheme: dark)';

function subscribeSystemScheme(onChange: () => void) {
  const mq = window.matchMedia(SYSTEM_DARK);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

function readSystemDark() {
  return window.matchMedia(SYSTEM_DARK).matches;
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ClientSettings>(() =>
    typeof window === 'undefined' ? DEFAULT_CLIENT_SETTINGS : { ...DEFAULT_CLIENT_SETTINGS, theme: readStoredTheme() },
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const systemDark = useSyncExternalStore(subscribeSystemScheme, readSystemDark, () => true);
  const resolvedTheme: 'dark' | 'light' = settings.theme === 'auto' ? (systemDark ? 'dark' : 'light') : resolveTheme(settings.theme);

  const settingsRef = useRef(settings);
  useLayoutEffect(() => {
    settingsRef.current = settings;
  }, [settings]);
  const loadSeqRef = useRef(0);
  const saveSeqRef = useRef(0);
  // Signed-out visitors keep settings in memory only (nothing to save to).
  // loadSettings is only called by SettingsSync once signed in; this ref is
  // for later saves.
  const { status } = useSession();
  const signedInRef = useRef(false);
  useEffect(() => {
    signedInRef.current = status === 'authenticated';
  }, [status]);

  useEffect(() => {
    applyAppearance(settings);
  }, [settings, systemDark]);

  const resetSettings = useCallback(() => {
    loadSeqRef.current += 1;
    saveSeqRef.current += 1;
    // Signed-out visitors keep the scheme they picked on this device.
    const local = { ...DEFAULT_CLIENT_SETTINGS, theme: readStoredTheme() };
    setSettings(local);
    setLoading(false);
    setSaving(false);
    setIsReady(true);
    setError(null);
    applyAppearance(local);
  }, []);

  const loadSettings = useCallback(async () => {
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
  }, []);

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
        const saved = await trackSave(settingsAPI.updateUserSettings(patch));
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
