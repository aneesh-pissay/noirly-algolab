import type { Metadata } from 'next';
import Link from 'next/link';
import { noirlyLogin } from './actions';
import { loginErrorMessage } from './messages';
import { safeNextPath } from '@/src/server/auth/routes';

export const metadata: Metadata = {
  title: 'Sign in · Noirly AlgoLab',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const redirectTo = safeNextPath(next) ?? '/dashboard';
  const message = loginErrorMessage(error);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col gap-6 text-center">
        <h1 className="text-2xl font-semibold">Sign in to AlgoLab</h1>
        <p className="text-sm opacity-75">
          Email, Google and verification are handled by Noirly Identity. No separate password to remember.
        </p>
        {message ? (
          <p role="alert" className="text-sm">
            {message}
          </p>
        ) : null}
        <form action={noirlyLogin}>
          <input type="hidden" name="next" value={redirectTo} />
          <button type="submit" className="w-full rounded-lg border px-4 py-3 font-semibold">
            Noirly Login
          </button>
        </form>
        <p className="text-sm opacity-75">
          New here? <Link href="/">See what AlgoLab does</Link>
        </p>
      </div>
    </main>
  );
}
