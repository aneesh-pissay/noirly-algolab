/**
 * The environment the e2e server runs with. Values here win over `.env.local`
 * (Next only fills in variables that are not already set).
 */
export const E2E_PORT = 3103;
export const E2E_BASE_URL = `http://localhost:${E2E_PORT}`;

/** Test-only secret: the server signs sessions with it, global-setup mints them. */
export const E2E_AUTH_SECRET = 'noirly-algolab-e2e-secret-not-for-production-use-0123456789';

export const E2E_MONGODB_URI = process.env.E2E_MONGODB_URI ?? 'mongodb://127.0.0.1:27017/noirly-algolab-e2e';

export const E2E_ENV: Record<string, string> = {
  NEXT_DIST_DIR: '.next-e2e',
  MONGODB_URI: E2E_MONGODB_URI,
  AUTH_SECRET: E2E_AUTH_SECRET,
  // No live Identity calls: sessions are minted locally with the test secret.
  AUTH_NOIRLY_ISSUER: 'https://identity.e2e.invalid',
  AUTH_URL: E2E_BASE_URL,
  NEXT_PUBLIC_APP_URL: E2E_BASE_URL,
};

/** Auth.js cookie name under `next start` over http (no __Secure- prefix). */
export const SESSION_COOKIE = 'authjs.session-token';

export const E2E_USER = {
  userId: '65f0000000000000000e2e01',
  identitySub: '65f0000000000000000e2eaa',
  name: 'Ada Lovelace',
  email: 'ada@e2e.test',
};

export const STORAGE_STATE = 'e2e/.auth/learner.json';
