import type { ClientSettings, ThemeMode } from '@/lib/settings.types';

/** Key read by @noirly-dev/ui's boot script (NoirlyHead) before first paint. */
export const THEME_STORAGE_KEY = 'theme';

export function resolveTheme(theme: ThemeMode): 'dark' | 'light' {
  if (theme === 'auto' && typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme === 'light' ? 'light' : 'dark';
}

/** The scheme the boot script applied, for visitors without saved settings. */
export function readStoredTheme(): ThemeMode {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function applyAppearance(settings: ClientSettings) {
  if (typeof document === 'undefined') return;

  const resolved = resolveTheme(settings.theme);
  const root = document.documentElement;

  // The package's palettes are light on :root and dark under `.dark`.
  root.classList.toggle('dark', resolved === 'dark');
  root.classList.remove('light');
  root.dataset.fontSize = settings.fontSize;
  root.dataset.reducedMotion = String(settings.reducedMotion);
  root.dataset.highContrast = String(settings.highContrast);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, resolved);
  } catch {
    /* private mode — the class swap still applies for this session */
  }
}
