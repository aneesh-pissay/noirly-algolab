'use client';

import { useId } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { Card, PageContainer, PageHeader, Switch } from '@noirly-dev/ui';
import Breadcrumbs from '@/app/components/Breadcrumbs';
import { identityAccountUrl } from '@/app/contexts/AuthContext';
import { useTheme } from '@/src/components/ThemeProvider';
import {
  useSettings,
  type CodeLanguage,
  type FontSize,
  type ThemeMode,
} from '@/app/contexts/SettingsContext';

const SCHEMES: { id: ThemeMode; label: string }[] = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'auto', label: 'System' },
];

const CODE_LANGUAGES: { id: CodeLanguage; label: string }[] = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
];

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const FONT_SIZES: { id: FontSize; label: string }[] = [
  { id: 'small', label: 'Small' },
  { id: 'medium', label: 'Medium' },
  { id: 'large', label: 'Large' },
];
const APP_LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Spanish' },
  { id: 'fr', label: 'French' },
  { id: 'de', label: 'German' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const id = useId();
  return (
    <Card className="space-y-4 p-6">
      <section aria-labelledby={id} className="space-y-4">
        <h2 id={id} className="section-title">
          {title}
        </h2>
        {children}
      </section>
    </Card>
  );
}

function PalettePicker() {
  const { paletteId, setPalette, themes } = useTheme();
  return (
    <div role="radiogroup" aria-label="Accent palette" className="flex flex-wrap gap-2">
      {themes.map((theme) => {
        const active = theme.id === paletteId;
        return (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPalette(theme.id)}
            className={`focusable inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
              active ? 'border-accent text-fg' : 'border-line text-fg-2 hover:border-line-strong hover:text-fg'
            }`}
          >
            <span className="flex gap-0.5" aria-hidden>
              <span className="size-2.5 rounded-full border border-black/10" style={{ background: theme.light.accent }} />
              <span className="size-2.5 rounded-full border border-white/10" style={{ background: theme.dark.accent }} />
            </span>
            {theme.name}
            {active ? <Check size={13} aria-hidden /> : null}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 rounded-[var(--r-md)] border border-line px-4 py-3">
      <div>
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        {description && <p className="text-xs text-fg-2">{description}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function OptionButtons<T extends string | number>({
  options,
  value,
  onChange,
  format,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  format?: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={String(opt)}
          type="button"
          aria-pressed={value === opt}
          onClick={() => onChange(opt)}
          className={`focusable rounded-full border px-4 py-1.5 text-sm transition ${
            value === opt
              ? 'border-accent bg-accent-soft text-fg'
              : 'border-line text-fg-2 hover:border-line-strong hover:text-fg'
          }`}
        >
          {format ? format(opt) : String(opt)}
        </button>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  const settings = useSettings();
  const { loading, saving, isReady, error, updateSettings } = settings;

  if (!isReady || loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-10" role="status">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" aria-hidden />
        <span className="sr-only">Loading settings</span>
      </div>
    );
  }

  return (
    <PageContainer size="md">
          <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]} />
          <PageHeader eyebrow="Settings" title="Settings" lead="Preferences sync to your account." />
          <div role="status" aria-live="polite" className="-mt-4 min-h-5 text-sm">
            {saving && <span className="text-fg-2">Saving…</span>}
            {error && <span className="text-destructive">Could not sync settings: {error}</span>}
          </div>

          <Section title="Account">
            <p className="text-sm text-fg-2">
              Your name, email, password and connected apps are managed in Noirly Identity.
            </p>
            <a href={identityAccountUrl()} className="btn btn-ghost btn-sm">
              Manage account <ExternalLink size={13} aria-hidden />
            </a>
          </Section>

          <Section title="Appearance">
            <div className="space-y-2">
              <p className="text-sm text-fg-2">Color scheme</p>
              <OptionButtons
                options={SCHEMES.map((s) => s.id)}
                value={settings.theme}
                onChange={(theme) => updateSettings({ theme })}
                format={(t) => SCHEMES.find((x) => x.id === t)?.label ?? t}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-fg-2">Accent palette (this device)</p>
              <PalettePicker />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-fg-2">Font Size</p>
              <OptionButtons
                options={FONT_SIZES.map((f) => f.id)}
                value={settings.fontSize}
                onChange={(fontSize) => updateSettings({ fontSize })}
                format={(f) => FONT_SIZES.find((x) => x.id === f)?.label ?? f}
              />
            </div>
            <Toggle
              label="High Contrast"
              description="Increase text and border contrast"
              checked={settings.highContrast}
              onChange={(highContrast) => updateSettings({ highContrast })}
            />
            <Toggle
              label="Reduced Motion"
              description="Minimize animations across the app"
              checked={settings.reducedMotion}
              onChange={(reducedMotion) => updateSettings({ reducedMotion })}
            />
          </Section>

          <Section title="Learning">
            <div className="space-y-2">
              <p className="text-sm text-fg-2">App Language</p>
              <OptionButtons
                options={APP_LANGUAGES.map((l) => l.id)}
                value={settings.language}
                onChange={(language) => updateSettings({ language })}
                format={(l) => APP_LANGUAGES.find((x) => x.id === l)?.label ?? l}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-fg-2">Animation Speed (default)</p>
              <OptionButtons
                options={SPEEDS}
                value={settings.animationSpeed}
                onChange={(animationSpeed) => updateSettings({ animationSpeed })}
                format={(s) => `${s}x`}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-fg-2">Code language</p>
              <OptionButtons
                options={CODE_LANGUAGES.map((l) => l.id)}
                value={settings.codeLanguage}
                onChange={(codeLanguage) => updateSettings({ codeLanguage })}
                format={(l) => CODE_LANGUAGES.find((x) => x.id === l)?.label ?? l}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="daily-goal" className="block text-sm text-fg-2">
                Daily goal (minutes): {settings.dailyGoal}
              </label>
              <input
                id="daily-goal"
                type="range"
                min={5}
                max={120}
                step={5}
                value={settings.dailyGoal}
                onChange={(e) => updateSettings({ dailyGoal: Number(e.target.value) })}
                className="w-full accent-accent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="reminder-time" className="block text-sm text-fg-2">
                Reminder time (optional)
              </label>
              <input
                id="reminder-time"
                type="time"
                value={settings.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                className="field-control rounded-[var(--r-md)] border border-line bg-surface-2 px-4 py-2 text-sm text-fg"
              />
            </div>
            <Toggle
              label="Auto-play Visualizations"
              checked={settings.autoPlayVideos}
              onChange={(autoPlayVideos) => updateSettings({ autoPlayVideos })}
            />
          </Section>

          <Section title="Notifications">
            <Toggle
              label="Course Updates"
              checked={settings.emailNotifications.courseUpdates}
              onChange={(courseUpdates) =>
                updateSettings({ emailNotifications: { courseUpdates } })
              }
            />
            <Toggle
              label="Achievements"
              checked={settings.emailNotifications.achievements}
              onChange={(achievements) =>
                updateSettings({ emailNotifications: { achievements } })
              }
            />
            <Toggle
              label="Weekly Progress"
              checked={settings.emailNotifications.weeklyProgress}
              onChange={(weeklyProgress) =>
                updateSettings({ emailNotifications: { weeklyProgress } })
              }
            />
            <Toggle
              label="Marketing"
              checked={settings.emailNotifications.marketing}
              onChange={(marketing) => updateSettings({ emailNotifications: { marketing } })}
            />
          </Section>

          <Section title="Privacy">
            <div className="space-y-2">
              <p className="text-sm text-fg-2">Profile Visibility</p>
              <OptionButtons
                options={['public', 'private'] as const}
                value={settings.profileVisibility}
                onChange={(profileVisibility) => updateSettings({ profileVisibility })}
                format={(v) => (v === 'public' ? 'Public' : 'Private')}
              />
            </div>
            <Toggle
              label="Show Progress on Profile"
              checked={settings.showProgress}
              onChange={(showProgress) => updateSettings({ showProgress })}
            />
            <Toggle
              label="Show Achievements on Profile"
              checked={settings.showAchievements}
              onChange={(showAchievements) => updateSettings({ showAchievements })}
            />
          </Section>
    </PageContainer>
  );
}
