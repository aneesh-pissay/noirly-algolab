import { randomUUID } from 'node:crypto';
import { encode } from 'next-auth/jwt';
import { E2E_AUTH_SECRET, E2E_USER, SESSION_COOKIE } from './env';

/**
 * Mints the Auth.js session cookie the Identity callback would produce for
 * the test learner, with a fresh session id (`sid`) like a real sign-in.
 */
export async function mintSession() {
  return encode({
    secret: E2E_AUTH_SECRET,
    salt: SESSION_COOKIE,
    token: {
      sub: E2E_USER.identitySub,
      userId: E2E_USER.userId,
      identitySub: E2E_USER.identitySub,
      name: E2E_USER.name,
      email: E2E_USER.email,
      sid: randomUUID(),
    },
  });
}
