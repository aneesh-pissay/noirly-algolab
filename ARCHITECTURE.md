# Noirly AlgoLab — architecture

How the app fits together. Feature status lives in
[docs/FEATURES.md](docs/FEATURES.md); the data model and API in
[DATABASE_DOCUMENTATION.md](DATABASE_DOCUMENTATION.md).

## Layout

```
proxy.ts                 CSP nonce + security headers, cross-origin mutation check, API rate limit
auth.ts                  Auth.js v5 instance (config in src/server/auth/config.ts)
app/
  layout.tsx             fonts, NoirlyHead/NoirlyExperience, theme bootstrap, AppProviders
  page.tsx, login/, privacy/   public pages
  (app)/                 signed-in pages inside the AppShell (dashboard, learn-path,
                         visualizer/[lessonId], compare, progress, settings, …)
  (app)/visual-lab/      standalone public demos
  api/                   route handlers (see DATABASE_DOCUMENTATION.md)
  components/visualizer/ lesson runtime: UniversalVisualizer, renderers, controls,
                         InputPanel, PredictPanel, CodePanel, LessonQuizView
  data/                  curriculum (318 lessons), lesson → algorithm routing, theory
  lib/                   client helpers: custom input, predict, compare, engine state
lib/                     shared server helpers: Mongo connection, curriculum progress,
                         streaks, gamification, settings mapping
models/                  Mongoose models (database noirly-codelab)
src/
  core/                  the visualization engine and every algorithm (unchanged)
  components/            AppShell, theme and palette controls, brand mark, sign-out
  features/              command palette, progress hooks
  services/              client fetchers (TanStack Query)
  server/
    auth/                Identity OIDC config, account linking, requireUser, revoked sessions
    quiz/                quiz bank: authored, derived-from-run and templated questions; grading
    review/              spaced-review schedule
    security/            request checks, Mongo-backed rate limits, body size limits
    users/               account deletion
e2e/                     Playwright suites (sessions minted with next-auth/jwt)
tests/                   Vitest route and server tests
```

## Request path

1. `proxy.ts` runs for every request. Pages get a per-request nonce and CSP
   (`script-src 'nonce-…' 'strict-dynamic'`) plus hardening headers; the root
   layout reads the nonce from `headers()`, so pages render dynamically.
   Mutating API calls with a cookie must be same-origin and carry
   `x-noirly-csrf: 1`; `/api/*` is rate limited per IP (300/min).
2. The proxy also redirects signed-out visitors of non-public pages to
   `/login?next=…` (`src/server/auth/routes.ts`); signed-in pages live under
   `app/(app)/` and share the AppShell.
3. Route handlers call `requireUser()` (`src/server/auth/session.ts`), which
   accepts either the Auth.js session cookie or an Identity access token
   (`Authorization: Bearer`, verified at Identity's userinfo endpoint), and
   returns AlgoLab's Mongo user id.

## Sign-in (Noirly Identity)

- Auth.js v5, one OIDC provider `noirly` (PKCE + state + nonce,
  `client_secret_post`), JWT sessions. Same pattern as Noirly Flow.
- The `signIn` callback runs `linkOrCreateUser`: find the user by
  `identitySub`; otherwise link an existing AlgoLab account with the same
  email **only if Identity marks the email verified**; otherwise create one.
- Each session carries a `sid`. Sign-out writes it to `revoked_sessions`, and
  the session callback rejects revoked ids.
- In development the cookies are `authjs.algolab.*` so apps on localhost don't
  share sessions.
- Identity's account-deleted Security Event Token (`POST
  /api/identity/account-deleted`, verified against Identity's JWKS) deletes
  the learner's AlgoLab data.

## Lessons and the visualizer

- `app/data/curriculum.ts` defines tracks → levels → tiers → lessons.
  `lessonRoutes.ts` maps each lesson to an engine algorithm id and its example
  input; `/visualizer/<lessonId>` is the lesson page, and old
  `/visualizer/<algorithmId>` links redirect to the first matching lesson.
- `src/core` holds the `VisualizerEngine` singleton, its store and all
  algorithms. Every algorithm is `generateSteps(input) → AlgorithmStep[]`.
  It is not modified by the app; the UI wraps it:
  - `app/lib/engineState.ts` exposes the engine through
    `useSyncExternalStore` with a cached snapshot.
  - `UniversalVisualizer` derives everything else (current step, code line,
    predict prompt, share link) from that state, and picks a renderer
    (array, stack, queue, tree, graph, generic) via `RendererFactory`.
  - `app/lib/lessonInput.ts` parses, validates and size-caps custom input and
    builds Random / Worst-case presets; `?input=` and `?step=` restore a
    shared run.
  - `app/lib/predict.ts` builds the "what happens next" choices from the next
    step's action; `app/lib/compare.ts` runs two algorithms on one input and
    counts steps, comparisons and writes.

## Quizzes, completion and review

- `GET /api/quiz/[lessonId]` returns questions without answers.
  `src/server/quiz/bank.ts` picks, per lesson: an authored set, else questions
  derived from the lesson's own run (`derived.ts`) plus conceptual questions
  (`challenges.ts`), else a templated complexity quiz.
- `POST /api/quiz/submit` grades on the server (70% passes), refuses locked
  lessons, stores `lastPassedAttempt`, and queues missed questions for review.
- `POST /api/progress/complete` completes a lesson only if it is unlocked and
  the last passed attempt is for that lesson (within 24 hours); then it unlocks the next lesson
  and awards XP (none for templated quizzes). Clients never send XP.
- `src/server/review/schedule.ts` re-asks a missed question after 1, 3 and 7
  days; the dashboard shows due items (`/api/review`).

## UI

- `@noirly-dev/ui` (installed from GitHub Packages) provides tokens, fonts,
  `AppShell` pieces, cards, buttons and the gold theme shared with Noirly Flow.
  `app/globals.css` maps the old class names onto its variables; see
  [docs/UI_MIGRATION.md](docs/UI_MIGRATION.md).
- Settings (color scheme, accent, font size, contrast, motion) are applied as
  attributes on `<html>` before paint and saved through `/api/user/settings`.
- Gamification (XP, levels, streaks) is computed but not shown.

## Testing and CI

- `pnpm test` (Vitest): curriculum invariants and content ratchets, quiz bank,
  grading and routes, auth config and linking, input parsing, predict,
  compare, review schedule.
- `pnpm test:e2e` (Playwright): builds and starts the app on :3103 against a
  wiped `noirly-algolab-e2e` database; sessions are minted directly, so
  Identity is not needed.
- `.github/workflows/ci.yml`: lint, typecheck, unit tests, build, then e2e with
  a MongoDB service.
