import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { withDb } from '@/lib/mongodb';
import { extractBearerToken, fetchIdentityUserInfo } from '@/src/server/auth/identity-userinfo';
import { linkOrCreateUser } from '@/src/server/auth/link-user';

export interface SessionUser {
  /** AlgoLab's MongoDB user id. */
  userId: string;
  identitySub: string;
}

function unauthorized(message = 'Not authenticated'): Response {
  return NextResponse.json({ error: message }, { status: 401 });
}

/** Mobile clients send a Noirly Identity access token instead of a cookie. */
async function userFromBearer(accessToken: string): Promise<SessionUser> {
  let info;
  try {
    info = await fetchIdentityUserInfo(accessToken);
  } catch {
    throw unauthorized('Invalid or expired access token');
  }
  try {
    const doc = await withDb(() =>
      linkOrCreateUser({
        sub: info.sub,
        email: info.email ?? null,
        emailVerified: info.email_verified === true,
        name: info.name ?? null,
        image: info.picture ?? null,
      }),
    );
    return { userId: String(doc._id), identitySub: info.sub };
  } catch (error) {
    if (error instanceof Error && error.name === 'AccountLinkError') throw unauthorized(error.message);
    throw error;
  }
}

/**
 * The signed-in user for an API route (Auth.js cookie, or an Identity bearer
 * token from the mobile app). Throws a 401 `Response` otherwise, so routes
 * pass it straight through from their catch block:
 *
 *   try { const { userId } = await requireUser(); … }
 *   catch (error) { if (error instanceof Response) return error; … }
 */
export async function requireUser(): Promise<SessionUser> {
  const bearer = extractBearerToken((await headers()).get('authorization'));
  if (bearer) return userFromBearer(bearer);

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw unauthorized();
  return { userId, identitySub: session.user.identitySub };
}
