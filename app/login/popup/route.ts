import { signIn } from '@/auth';
import { safeNextPath } from '@/src/server/auth/routes';

/**
 * Starts the Identity sign-in on the server and redirects the popup straight
 * to it (same flow as Noirly Flow). Also works as a plain page navigation
 * when popups are blocked: popup-complete then redirects instead of closing.
 */
export async function GET(request: Request) {
  const next = safeNextPath(new URL(request.url).searchParams.get('next')) ?? '/dashboard';
  const redirectTo = `/login/popup-complete?next=${encodeURIComponent(next)}`;
  const url = await signIn('noirly', { redirectTo, redirect: false }, { display: 'popup', prompt: 'select_account' });
  return Response.redirect(url, 302);
}
