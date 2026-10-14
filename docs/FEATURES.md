# Noirly AlgoLab — features

What ships today, and what is not done yet. Keep this file current: it replaces
the older status notes (`docs/SORTING_STATUS.md`, the counts in the previous
`ARCHITECTURE.md`).

## Ships today

### Learning
- **Curriculum**: 318 lessons in three tracks (Data Structures 188, Algorithms 98,
  Patterns 32), three levels and three difficulty tiers each.
- **Lesson flow**: Theory → Visualize → Quiz. The quiz unlocks after stepping to
  the final frame of the visualization (or if the lesson is already complete).
- **Unlocking**: lessons unlock in order; the server refuses to complete a locked
  lesson.
- **Visualizer**: every lesson runs on the shared engine (`src/core`), with array,
  stack, queue, tree, graph and generic renderers, a synced code panel and an
  execution panel (action, explanation, variables, memory, complexity).
- **Custom input**: 223 lessons accept the learner's own array, string, target,
  k, pattern or graph edges, plus Random and Worst-case presets. Validated and
  size-capped.
- **Predict mode**: before each step, pick what happens next; the score is shown
  with the quiz.
- **Keyboard**: Space play/pause, ←/→ step, R reset, [ ] speed, P predict,
  1/2/3 tabs, / or ⌘K/Ctrl K search.
- **Share links**: "Share this step" copies a link with `?input=` and `?step=`
  that reopens the lesson on the same input and step. Old
  `/visualizer/<algorithmId>` links redirect to the lesson.
- **Quizzes**: graded on the server. 233 lessons ask about their own run (state
  after a step, next operation, a tracked variable, the outcome) plus a
  complexity question; high-traffic lessons add hand-written conceptual
  questions; 2 lessons have fully authored sets. 70% passes.
- **Theory**: hand-written for 37 lessons; the rest use a generated outline
  built from the topic and the algorithm.
- **Spaced review**: missed quiz questions return on the dashboard after 1, 3
  and 7 days.
- **Compare**: two sorting, searching or graph-traversal algorithms side by side
  on the same input, with step, comparison and write counters.
- **Visual Lab**: 55 standalone, public demos (sorting, searching, two pointers,
  sliding window, graphs).
- **Command palette**: jump to any lesson, demo or page; "continue where I left
  off".

### Account and platform
- **Noirly Identity sign-in** (OIDC, PKCE + state + nonce), JWT session cookie,
  revocable sessions, account linking by verified email, Identity
  account-deleted webhook.
- **Security**: CSRF header + same-origin checks on cookie mutations, per-IP API
  rate limit, per-user quiz rate limit, CSP with nonces, production secret
  checks.
- **Settings**: color scheme (dark/light/system), accent palette, font size,
  high contrast, reduced motion, learning and notification preferences;
  "Manage account" (Identity); progress export as JSON.
- **UI**: shared `@noirly-dev/ui` (Noirly Flow's gold theme, fonts, shell,
  effects), mobile drawer, accessible tabs, labelled controls, live step
  announcements, reduced-motion support, Noirly app switcher.

## Not done yet

- **Content**: 83 lessons still use generic complexity quizzes (their example run
  is a single step, e.g. push one value); 281 lessons use generated theory.
  `app/data/curriculum.test.ts` holds a ratchet so these numbers only go down.
- **XP, levels, streaks** are calculated on the server but not shown (the
  gamification UI stays hidden). Lessons completed with a generic quiz earn no
  XP.
- **Visual Lab demos** are standalone pages that predate the shared renderers;
  they are not yet on custom input, predict mode or share links, and some still
  carry lint warnings (scoped in `eslint.config.mjs`).
- **Custom input** is not offered for tree, grid, linked-list and matrix lessons.
- **Login popup** (Flow's `/login/popup` flow) is not implemented; sign-in is a
  full-page redirect.
- **Mobile app**: the API accepts Noirly Identity access tokens (`Bearer`), but
  the app's deep-link file still lists the old `/auth/*` paths.
- **Lighthouse** targets (≥ 95 accessibility) have not been measured in CI.
