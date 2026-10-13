# UI migration: Material-style tokens → `@noirly-dev/ui`

AlgoLab now uses the same design system as Noirly Flow: the shared `@noirly-dev/ui`
package (published as `@aneesh-pissay/ui` on GitHub Packages), its gold palette, its
fonts, effects and shell. This note records what the package provides and how the
old classes map onto it, so new screens do not reintroduce the old tokens.

## What the package provides

| Area | From `@noirly-dev/ui` | Used in AlgoLab |
|---|---|---|
| Palettes | `NOIRLY_THEMES` (blue, gold, coral, violet, teal, rose, forest), `DEFAULT_THEME_ID = "gold"`, light on `:root`, dark under `.dark` | `<html class="dark" data-theme="gold">`, `NoirlyHead themeId="gold"`; palette picker in Settings (forest removed, as in Flow) |
| Theme CSS variables | `--bg`, `--bg-deep`, `--surface`, `--surface-2`, `--text`, `--text-secondary`, `--text-muted`, `--hairline`, `--hairline-strong`, `--accent`, `--accent-ink`, `--accent-soft`, `--positive`, `--negative`, `--destructive`, `--elev-1..3`, radii `--r-xs..xl` | Every colour in the app |
| Tailwind theme | `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `bg-muted`, `border-border`, `bg-accent`, `text-accent-foreground`, `text-positive`, `text-negative`, `text-destructive`, `rounded-md` (= `--r-md`), `font-display` (Fraunces), `font-sans` (Hanken Grotesk), `font-mono` (JetBrains Mono) | Yes |
| Component classes | `.surface`, `.surface-flat`, `.surface-interactive`, `.grain`, `.btn` (`-solid`, `-ghost`, `-sm`, `-lg`), `.chip`, `.pill[data-tone]`, `.eyebrow`, `.mono-label`, `.meta`, `.page-title`, `.section-title`, `.display-md/lg`, `.lede`, `.copy`, `.tab-list`/`.tab`, `.nav-item`, `.focusable`, `.shell`, `.section-y`, `.section-rule`, `.skip-link` | Yes |
| React | `AppShell`, `SidebarBrand`, `PageContainer`, `PageHeader`, `Card*`, `StatGroup`/`StatCell`, `Avatar`, `Switch`, `Dialog`, `EmptyState`, `AuthShell`, `Button`, `NoirlyHead`, `noirlyFontClassName`, `applyPalette` … | Yes |
| Presentation | `NoirlyExperience` (`/experience`), `TiltCard`, `SpotlightCard`, `MotionProvider` (`/motion`), Lenis smooth scroll (`/scroll`) | `NoirlyExperience mark="Noirly AlgoLab" pageTransition={false} cursor={false}`; tilt on track tiles, spotlight on landing and lesson cards |

`docs/ARCHITECTURE.md` in noirly-flow still lists old cyan/charcoal hex values; they
are not used. All colours come from the package variables above.

## AlgoLab aliases (`app/globals.css`)

Short Tailwind names for package variables. They define no colours of their own.

| Utility | Variable |
|---|---|
| `bg-bg` | `--bg` |
| `bg-surface` | `--surface` |
| `bg-surface-2` | `--surface-2` |
| `text-fg` | `--text` |
| `text-fg-2` | `--text-secondary` |
| `text-fg-3` | `--text-muted` |
| `border-line` / `bg-line` | `--hairline` |
| `border-line-strong` | `--hairline-strong` |
| `bg-accent-soft` | `--accent-soft` |
| `text-accent-ink` | `--accent-ink` |

## Class mapping

| Old (Material-style) | New |
|---|---|
| `bg-surface-dim`, `bg-surface-container-lowest`, `bg-background` | `bg-bg` / `bg-background` |
| `bg-surface-container`, `bg-surface-container-low`, `bg-surface` | `bg-surface` (or `.surface` for cards) |
| `bg-surface-container-high/-highest`, `bg-surface-variant`, `bg-secondary-container` | `bg-surface-2` |
| `text-on-surface`, `text-on-background` | `text-fg` |
| `text-on-surface-variant`, `text-secondary` | `text-fg-2` |
| `text-outline-variant` | `text-fg-3` |
| `border-outline-variant/<50` | `border-line` |
| `border-outline-variant/≥50` | `border-line-strong` |
| `bg-primary`, `text-primary`, `border-primary`, `*-primary-container` | `*-accent` (opacity modifiers kept) |
| `text-on-primary` | `text-accent-ink` |
| `*-tertiary`, `*-warning` | `*-negative` |
| `*-success` | `*-positive` |
| `*-error` | `*-destructive` |
| `glass-card`, `accent-card` | `.surface` |
| `glass-panel` | kept, redefined on `--surface` + `--hairline` |
| `node-glow`, `glow-primary` | `shadow-[0_0_20px_var(--accent-soft)]` |
| `font-display` (Geist) | `font-display` (Fraunces, from the package) |
| `font-body-md/lg` | `font-sans` |
| `font-code-md`, `font-label-sm` | `font-mono` |
| `text-headline-sm`, `text-label-sm`, `text-body-md`, `text-display` | `text-lg`, `text-xs`, `text-sm`, `text-3xl` |
| `rounded-xl`/`rounded-2xl` on cards | `rounded-[var(--r-lg)]` / `.surface` |
| Tailwind palette colours (`blue-400`, `green-500`, `yellow-400`, `red-500`, `slate-*`, `white/…`) | `accent`, `positive`, `negative`, `destructive`, `fg*`/`line*` |
| Hex / `rgba()` in SVG and inline styles | `var(--accent)`, `var(--positive)`, `var(--negative)`, `var(--destructive)`, `var(--surface-2)`, `var(--hairline-strong)`, `var(--text*)` |
| Step counters | `.matrix-numeral` |

`grep -R "surface-container\|on-surface\|outline-variant" app src` returns nothing.

## Visualizer state tokens

Renderers read semantic variables (`app/globals.css`), never hex:

| Token | Meaning | Non-colour cue |
|---|---|---|
| `--viz-compare` | comparing / searching | dashed outline, `?` |
| `--viz-swap` | swapping / shifting | double outline, `⇄` |
| `--viz-pivot` | pivot / chosen | double outline, `◆` |
| `--viz-done` | placed / found | solid outline, `✓` |
| `--viz-fail` | not found / removing | dashed outline, `✕` / `−` |
| `--viz-active` | other highlighted work | solid outline, `•` |
| `--viz-idle` | edges, idle outlines | dashed stroke in graphs |

`RendererFactory` and the `AlgorithmStep` contract are unchanged
(`app/components/visualizer/renderers/vizState.ts` maps `step.action` to a state).

## Icons

Material Symbols are gone. `src/components/Icon.tsx` maps the Material names still
used in data and older screens to `lucide-react` (`<Icon name="skip_next" />`), sized
in `em` so existing `text-*` sizes still apply. Track icons come from
`iconFor(trackId)`; the curriculum data no longer stores icon names.

## Theme, motion and accessibility

- Dark is the default; light comes from the package's `:root` palette. Settings →
  Appearance picks Dark / Light / System (saved to the account) and the accent palette
  (saved on the device, like Flow). Both are applied before first paint by
  `NoirlyHead`'s boot script (`localStorage.theme` / `localStorage.palette`).
- `prefers-reduced-motion` and Settings → Reduced motion disable transitions; the
  package's `MotionProvider` drops framer-motion transforms; tilt and spotlight are
  hidden.
- Focus rings come from the package (`:focus-visible` uses `--accent`); interactive
  elements use `.focusable`. Lesson steps are an ARIA tablist, the step explanation
  is a live region, playback buttons have labels and `aria-keyshortcuts`.

## Shell

`app/(app)/layout.tsx` renders `src/components/AppShell.tsx` (the package's
`AppShell`): sidebar on desktop, drawer on mobile, top bar with breadcrumb, search
(⌘K / Ctrl K) and the theme toggle. Pages publish their breadcrumb with
`<Breadcrumbs>`, which shows inline on mobile and in the top bar on desktop.
Public pages (`/`, `/login`, `/privacy`) use `PublicHeader` + `SiteFooter`, matching
Flow's marketing pages.
