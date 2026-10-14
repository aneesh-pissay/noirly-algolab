# Noirly AlgoLab — data model and API

MongoDB via Mongoose. The database keeps its original name, **`noirly-codelab`**;
model changes are additive only. Accounts themselves (passwords, Google
sign-in, email verification) belong to Noirly Identity — AlgoLab keeps a
local user record linked to it.

## Collections

### `users` — `models/User.ts`

| Field | Notes |
|---|---|
| `identitySub` | Noirly Identity subject. Unique, sparse. Set on first Identity sign-in. **New.** |
| `username`, `email` | Unique. Filled from Identity for new accounts. |
| `password` | Legacy hash, **now optional** — Identity accounts have none and it is never read. |
| `isVerified` | Mirrors Identity's `email_verified` at link time. |
| `firstName`, `lastName`, `avatar`, `bio` | Profile. |
| `currentLevel`, `xp`, `streak`, `lastActiveDate` | Gamification, computed on the server (not shown in the UI). |
| `role` | `user` \| `admin` \| `instructor`. |
| `verificationToken*`, `resetPassword*` | Legacy, unused. |

Linking: by `identitySub`; else an existing user with the same email **only
if Identity says it is verified**; else a new user. `pnpm
report:unlinked-users` counts users without `identitySub`.

### `user_curriculum_progress` — `models/UserCurriculumProgress.ts`

One document per user.

| Field | Notes |
|---|---|
| `completedLessons`, `unlockedLessons`, `unlockedTiers`, `unlockedTopics` | Lesson ids from `app/data/curriculum.ts`. |
| `currentLesson`, `recentlyCompleted` | "Continue" pointer and recent list. |
| `lastPassedAttempt` | `{ lessonId, score, templated, passedAt }` — the last server-graded passed quiz. `/api/progress/complete` requires it to match the lesson and be under 24 hours old. **New.** |
| `reviewQueue` | `[{ lessonId, questionId, stage 0–2, dueAt, missedAt }]` — missed questions due after 1, 3, 7 days. **New.** |

### `usersettings` — `models/UserSettings.ts`

Appearance (`theme`, `fontSize`, `highContrast`, `reducedMotion`), learning
(`dailyGoal`, `playbackSpeed`, `codeLanguage`, `autoPlayVideos`,
`reminderTime`), `emailNotifications`, privacy flags. Accent palette and color
scheme are mapped onto these by `lib/settings-mapper.ts`.

### `userprogresses`, `userachievements` — `models/UserProgress.ts`, `models/UserAchievement.ts`

Older per-topic progress and achievement records, kept for existing data. They
no longer affect XP.

### `revoked_sessions` — `src/server/models/RevokedSession.ts`

`{ sid, expiresAt }`. Written on sign-out; sessions with a revoked `sid` are
rejected. TTL index on `expiresAt`. **New.**

### `securityratecounters` — `src/server/security/rate-limit.ts`

`{ _id: sha256(key + window), count, expiresAt }`. Fixed-window counters for
rate limits; no raw IPs are stored. TTL index on `expiresAt`. **New.**

## API

All routes except auth and the webhook require a signed-in user: the Auth.js
session cookie, or `Authorization: Bearer <Noirly Identity access token>`.
Cookie requests that change data must be same-origin and send
`x-noirly-csrf: 1`. Bodies are validated with zod; errors are
`{ "error": "<code or message>" }`. `/api/*` is limited to 300 requests per
minute per IP.

### Auth and account

| Route | |
|---|---|
| `GET/POST /api/auth/*` | Auth.js (sign-in with provider `noirly`, callback, session, sign-out). |
| `POST /api/identity/account-deleted` | Identity's account-deleted Security Event Token (RS256, verified against Identity's JWKS, `aud` = client id, 5-minute max age). Deletes all AlgoLab data for that `sub`. Idempotent. |

The old `/api/auth/register`, `/login`, `/me`, `/logout`, password reset and
email verification endpoints are removed.

### Curriculum progress

| Route | |
|---|---|
| `GET /api/progress` | Aggregated progress: completed/unlocked lessons, current lesson, level, XP, streak. |
| `PATCH /api/progress` | `{ currentLesson }` — move the "continue" pointer. |
| `POST /api/progress/complete` | `{ lessonId }` — completes the lesson. `403 lesson_locked` if not unlocked, `403 quiz_not_passed` without a passed attempt for this lesson in the last 24 hours. Unlocks the next lesson; XP only for non-templated quizzes. |
| `GET /api/progress/export` | Everything AlgoLab stores for the learner, as a JSON download. |

### Quizzes and review

| Route | |
|---|---|
| `GET /api/quiz/[lessonId]` | `{ lessonId, templated, passScore, questions: [{ id, question, options }] }` — no answers. `403 lesson_locked`. |
| `POST /api/quiz/submit` | `{ lessonId, answers: [{ questionId, choiceIndex }] }` → `{ score, passed, correct, total, results, templated }`. Graded on the server, 70% passes. `403 lesson_locked`; rate limited per user. Records `lastPassedAttempt` and queues missed questions. |
| `GET /api/review` | `{ due (up to 10 questions), dueCount, nextDueAt, total }`. |
| `POST /api/review/answer` | `{ lessonId, questionId, choiceIndex }` → `{ correct, correctIndex, explanation, nextDueAt }`. Rate limited per user. |

### User

| Route | |
|---|---|
| `GET/PATCH /api/user/profile` | Profile fields. |
| `GET/PATCH /api/user/settings` | Settings (defaults created on first read). |
| `GET/POST /api/user/progress` | Legacy per-topic progress; `POST` no longer awards XP. |
| `GET/POST /api/user/achievements` | Legacy achievements; a client-sent `xpReward` never changes XP. |
| `GET /api/user/roadmap` | Legacy roadmap with per-topic progress. |
