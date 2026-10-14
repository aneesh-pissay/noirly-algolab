/**
 * Route table for proxy.ts. Kept free of Next/Auth imports so it is unit
 * tested on its own.
 */

/** Readable without an account (D5: the visual lab stays public for sharing and SEO). */
export function isPublicPath(pathname: string): boolean {
  return (
    pathname === '/' ||
    pathname === '/privacy' ||
    pathname === '/login' ||
    pathname === '/visual-lab' ||
    pathname.startsWith('/visual-lab/') ||
    pathname.startsWith('/.well-known/') ||
    pathname.startsWith('/api/auth/') ||
    pathname === '/api/identity/account-deleted'
  );
}

/** Same-origin path only: `/x` yes, `//evil.example` and `https://…` no. */
export function safeNextPath(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return null;
  return value;
}

export type RouteDecision =
  | { type: 'next' }
  | { type: 'redirect'; location: string };

/** Where a page request goes, given whether the visitor is signed in. */
export function decidePageRoute(pathname: string, search: string, signedIn: boolean, nextParam: string | null): RouteDecision {
  if (signedIn) {
    if (pathname === '/login') return { type: 'redirect', location: safeNextPath(nextParam) ?? '/dashboard' };
    if (pathname === '/') return { type: 'redirect', location: '/dashboard' };
    return { type: 'next' };
  }
  if (isPublicPath(pathname)) return { type: 'next' };
  // API routes answer 401 themselves; they must not redirect.
  if (pathname.startsWith('/api/')) return { type: 'next' };
  return { type: 'redirect', location: `/login?next=${encodeURIComponent(pathname + search)}` };
}
