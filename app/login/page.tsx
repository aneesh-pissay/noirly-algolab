import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthShell } from '@noirly-dev/ui';
import { BrandMark } from '@/src/components/BrandMark';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { NoirlyLoginButton } from '@/app/components/NoirlyLoginButton';
import { safeNextPath } from '@/src/server/auth/routes';
import { loginErrorMessage } from './messages';

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
    <div id="main" className="relative flex min-h-full flex-1 flex-col">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle size="sm" />
      </div>
      <AuthShell
        logo={<BrandMark className="size-14 md:size-16" />}
        title="Sign in to AlgoLab"
        lead="Email, Google and verification are handled by Noirly Identity. No separate password to remember."
        footer={
          <>
            New here?{' '}
            <Link href="/" className="text-[var(--accent)] hover:underline">
              See what AlgoLab does
            </Link>
            {' · '}
            <Link href="/privacy" className="text-[var(--accent)] hover:underline">
              Privacy
            </Link>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          {message ? (
            <p role="alert" className="rounded-[var(--r-md)] bg-[var(--accent-soft)] p-3 text-sm text-[var(--text)]">
              {message}
            </p>
          ) : null}
          <NoirlyLoginButton next={redirectTo} />
          <p className="meta text-center">You&apos;ll come back here after signing in</p>
        </div>
      </AuthShell>
    </div>
  );
}
