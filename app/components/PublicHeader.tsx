'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import BrandMark from './BrandMark';
import ThemeToggle from './ThemeToggle';

export default function PublicHeader() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navLinks = !loading && user ? (
    <Link
      href="/learn-path"
      onClick={() => setMenuOpen(false)}
      className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-on-primary transition hover:bg-primary/90"
    >
      Continue Learning
    </Link>
  ) : (
    <>
      <Link
        href="/login"
        onClick={() => setMenuOpen(false)}
        className="cursor-pointer rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-primary/20"
      >
        Noirly Login
      </Link>
    </>
  );

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-outline-variant/40 bg-background/95 px-4 backdrop-blur-md sm:h-[4.5rem] sm:px-6">
        <BrandMark variant="header" priority />

        {/* Desktop nav */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {navLinks}
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-high text-on-surface"
          >
            <span className="material-symbols-outlined text-[22px]">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu panel */}
      {menuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="fixed top-16 right-0 left-0 z-[70] border-b border-outline-variant/40 bg-surface-container p-4 shadow-lg sm:top-[4.5rem] md:hidden">
            <div className="flex flex-col gap-2">{navLinks}</div>
          </nav>
        </>
      )}
    </>
  );
}
