'use client';

import { SessionProvider, signOut, useSession } from 'next-auth/react';
import type { ReactNode } from 'react';

/**
 * Sessions come from Noirly Identity via Auth.js (httpOnly cookie). Route
 * protection lives in proxy.ts; this is only the client view of the session.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export interface AuthUser {
  /** AlgoLab's MongoDB user id. */
  id: string;
  identitySub: string;
  name: string;
  email: string;
  image: string | null;
}

export function useAuth() {
  const { data, status, update } = useSession();
  const sessionUser = data?.user;
  const user: AuthUser | null = sessionUser?.id
    ? {
        id: sessionUser.id,
        identitySub: sessionUser.identitySub,
        name: sessionUser.name || sessionUser.email?.split('@')[0] || 'Learner',
        email: sessionUser.email ?? '',
        image: sessionUser.image ?? null,
      }
    : null;

  return {
    user,
    loading: status === 'loading',
    isAuthenticated: status === 'authenticated' && Boolean(user),
    /** Ends the session; the `signOut` event revokes its `sid` server-side. */
    logout: () => signOut({ redirectTo: '/login' }),
    refreshUser: async () => {
      await update();
    },
  };
}

export function identityAccountUrl(): string {
  const base = (process.env.NEXT_PUBLIC_IDENTITY_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return `${base}/account`;
}
