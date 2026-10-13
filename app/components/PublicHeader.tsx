'use client';

import Link from 'next/link';
import { BrandMark } from '@/src/components/BrandMark';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

/** Header for public pages (landing, privacy, login). Mirrors Flow's marketing header. */
export default function PublicHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--hairline)] bg-[var(--bg)]/70 backdrop-blur-xl">
      <div className="shell flex h-[4.5rem] items-center justify-between gap-4 md:h-20">
        <Link
          href="/"
          aria-label="Noirly AlgoLab home"
          className="focusable flex min-w-0 items-center gap-3 rounded-[var(--r-sm)] text-[var(--text)]"
        >
          <BrandMark className="size-10 shrink-0 md:size-12" name="" />
          <span className="hidden truncate font-display text-lg font-bold uppercase leading-none tracking-[-0.04em] min-[400px]:inline md:text-2xl">
            Noirly AlgoLab
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <Link href="/visual-lab" className="chip hidden sm:inline-flex">
            Visual Lab
          </Link>
          {!loading && user ? (
            <Link href="/dashboard" className="btn btn-ghost btn-sm">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="btn btn-ghost btn-sm">
              Sign in
            </Link>
          )}
          <ThemeToggle size="sm" />
        </div>
      </div>
    </header>
  );
}
