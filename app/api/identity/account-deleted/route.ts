import { createRemoteJWKSet, jwtVerify } from 'jose';
import { withDb } from '@/lib/mongodb';
import { identityIssuer } from '@/src/server/auth/identity-userinfo';
import { readLimitedText } from '@/src/server/security/body';
import { deleteAlgoLabAccountData } from '@/src/server/users/delete-account';

/**
 * Noirly Identity calls this when someone deletes their Noirly account, so
 * their AlgoLab progress goes too (same contract as Noirly Flow).
 *
 * The body is a Security Event Token: a JWT signed with Identity's OIDC key,
 * `aud` = this app's client id (AUTH_NOIRLY_CLIENT_ID), `sub` = the deleted
 * user. Deletion is idempotent, so a replayed notice does no harm.
 * Register it in Identity: ACCOUNT_DELETION_WEBHOOKS=noirly-algolab=<this URL>.
 */

const ACCOUNT_DELETED_EVENT = 'https://noirly.dev/events/account-deleted';

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
function identityKeys() {
  jwks ??= createRemoteJWKSet(new URL(`${identityIssuer()}/.well-known/jwks.json`));
  return jwks;
}

export async function POST(request: Request) {
  const audience = process.env.AUTH_NOIRLY_CLIENT_ID;
  if (!audience) {
    return Response.json({ error: 'not_configured' }, { status: 503 });
  }

  let sub: string;
  try {
    const token = (await readLimitedText(request, 16384)).trim();
    const { payload } = await jwtVerify(token, identityKeys(), {
      issuer: identityIssuer(),
      audience,
      typ: 'secevent+jwt',
      algorithms: ['RS256'],
      requiredClaims: ['exp', 'iat', 'sub', 'jti'],
      maxTokenAge: '5 minutes',
    });
    const events = payload.events as Record<string, unknown> | undefined;
    if (!payload.sub || !events || !(ACCOUNT_DELETED_EVENT in events)) {
      return Response.json({ error: 'invalid_event' }, { status: 400 });
    }
    sub = payload.sub;
  } catch {
    return Response.json({ error: 'invalid_token' }, { status: 401 });
  }

  try {
    const summary = await withDb(() => deleteAlgoLabAccountData(sub));
    return Response.json({ ok: true, ...summary });
  } catch {
    console.error('AlgoLab account deletion failed');
    // Identity keeps the notice and retries later.
    return Response.json({ error: 'internal_error' }, { status: 500 });
  }
}
