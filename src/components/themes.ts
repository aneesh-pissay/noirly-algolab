import { NOIRLY_THEMES } from "@noirly-dev/ui";

/**
 * Palettes AlgoLab offers — the same set as Noirly Flow, which drops "forest"
 * (its green accent collides with the "done" state colour). Removed here
 * rather than in @noirly-dev/ui, which the other Noirly apps also use.
 */
export const REMOVED_THEME_IDS = ["forest"] as const;

export const APP_THEMES = NOIRLY_THEMES.filter(
  (theme) => !(REMOVED_THEME_IDS as readonly string[]).includes(theme.id),
);

export function isAppThemeId(id: string): boolean {
  return APP_THEMES.some((theme) => theme.id === id);
}
