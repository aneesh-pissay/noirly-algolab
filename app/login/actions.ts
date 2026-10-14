'use server';

import { signIn } from '@/auth';
import { safeNextPath } from '@/src/server/auth/routes';

/** Starts the OIDC round trip (PKCE + state + nonce) against Noirly Identity. */
export async function noirlyLogin(formData: FormData) {
  const next = safeNextPath(String(formData.get('next') ?? '')) ?? '/dashboard';
  await signIn('noirly', { redirectTo: next });
}
