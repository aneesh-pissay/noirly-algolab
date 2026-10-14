# Noirly AlgoLab

**Visual DSA learning — understand, don't memorize.**

Noirly AlgoLab teaches data structures and algorithms through step-by-step
visualizations, synced code tracing and server-graded quizzes, organised as a
318-lesson path across three tracks (Data Structures, Algorithms, Patterns).
It is part of the Noirly ecosystem: sign-in is Noirly Identity (OIDC), and the
UI is the shared `@noirly-dev/ui` design system used by Noirly Flow.

- What ships today and what is not done yet: [docs/FEATURES.md](docs/FEATURES.md)
- How it fits together: [ARCHITECTURE.md](ARCHITECTURE.md)
- Data model and API: [DATABASE_DOCUMENTATION.md](DATABASE_DOCUMENTATION.md)
- Design system mapping: [docs/UI_MIGRATION.md](docs/UI_MIGRATION.md)

## Stack

Next.js 16 (App Router, `proxy.ts`), React 19, TypeScript, Tailwind CSS 4 with
`@noirly-dev/ui`, Auth.js v5 (Noirly Identity OIDC, JWT sessions), MongoDB via
Mongoose, Zustand + TanStack Query, zod, cmdk, framer-motion, Lenis. Vitest for
unit/route tests, Playwright for end-to-end tests.

## Getting started

Requirements: **Node 22+** (see `.nvmrc`), **pnpm 10** (`corepack enable`),
MongoDB, and a running [Noirly Identity](https://github.com/aneesh-pissay/noirly-identity).

```bash
cp .env.example .env.local      # fill in the values below
pnpm install                    # needs GITHUB_TOKEN, see "Packages"
pnpm dev                        # http://localhost:3003
```

AlgoLab runs on **:3003** so it can sit next to Identity (:3000) and Flow
(:3002). In development its Auth.js cookies are named `authjs.algolab.*`, so
sessions of sibling apps on localhost never collide.

### Register AlgoLab in Noirly Identity

In Identity's admin UI (`/clients`, admin account required) create a
**confidential** client:

- Client id: `noirly-algolab`
- Redirect URIs (exact match):
  - `http://localhost:3003/api/auth/callback/noirly`
  - `https://<your production host>/api/auth/callback/noirly`
- Copy the client secret into `AUTH_NOIRLY_CLIENT_SECRET` (it is shown once).

To have AlgoLab delete a learner's data when they delete their Noirly account,
add `noirly-algolab=https://<host>/api/identity/account-deleted` to Identity's
`ACCOUNT_DELETION_WEBHOOKS`.

### Environment

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_APP_URL`, `AUTH_URL` | This app's URL (`http://localhost:3003`) |
| `AUTH_SECRET` | 32+ random bytes (`openssl rand -base64 48`). Production refuses short, low-entropy or placeholder values. |
| `AUTH_TRUST_HOST` | `true` |
| `MONGODB_URI` | MongoDB connection string. The database keeps its original name, `noirly-codelab`. |
| `AUTH_NOIRLY_ISSUER` | Identity URL. Must be HTTPS in production. |
| `AUTH_NOIRLY_CLIENT_ID` / `AUTH_NOIRLY_CLIENT_SECRET` | The client registered above |
| `NEXT_PUBLIC_IDENTITY_URL` | Identity URL for "Manage account" links |
| `NEXT_PUBLIC_FLOW_URL` | Optional: Noirly Flow URL for the app switcher |
| `TRUSTED_CLIENT_IP_HEADER` | Header carrying the client IP for rate limits (default `x-forwarded-for`) |
| `GITHUB_TOKEN` | Token with `read:packages`, to install `@noirly-dev/ui` |

### Packages

`@noirly-dev/ui` is installed from GitHub Packages as
`npm:@aneesh-pissay/ui@0.3.1` (see `.npmrc`). Set `GITHUB_TOKEN` locally and in
Vercel (build and install). In GitHub Actions the workflow uses
`NOIRLY_PACKAGES_TOKEN` if set, otherwise the job's `GITHUB_TOKEN` — the
package must grant this repository read access.

## Scripts

| Command | |
|---|---|
| `pnpm dev` | Dev server on :3003 |
| `pnpm build` / `pnpm start` | Production build (`next build --webpack`, as Flow) and server |
| `pnpm lint` / `pnpm typecheck` | ESLint / `tsc --noEmit` |
| `pnpm test` | Vitest: curriculum, quizzes, auth, routes, generators |
| `pnpm test:e2e` | Playwright against a production build on :3103 with a wiped `noirly-algolab-e2e` database (needs MongoDB on 127.0.0.1:27017 or `E2E_MONGODB_URI`; Identity is not needed) |
| `pnpm report:unlinked-users` | Read-only count of accounts not yet linked to Noirly Identity |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit tests and build, then
the e2e suite with a MongoDB service.

## Accounts and existing users

Learners sign in with **Noirly Login** (email or Google, handled by Identity).
On first sign-in an Identity account is linked to an existing AlgoLab account
**with the same email, only if Identity says the email is verified**, so earlier
progress stays attached. Otherwise a new AlgoLab user is created. Legacy
password fields remain in the database but are no longer used.

## Deployment

Vercel: set the environment above (with `GITHUB_TOKEN` available at install
time), and add the production redirect URI to the Identity client.
`AUTH_SECRET` and `AUTH_NOIRLY_ISSUER` are checked when the build collects page
data, so they must be set for every environment that builds (Production and
Preview); a missing or weak value fails the build with a message naming it.
The pre-Identity app used `JWT_SECRET`, which is no longer read. The proxy
sets a per-request CSP nonce, so pages render dynamically.
