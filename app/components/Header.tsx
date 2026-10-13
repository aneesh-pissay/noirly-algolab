'use client';

import { useState, useRef, useEffect } from 'react';
import { identityAccountUrl, useAuth } from '../contexts/AuthContext';
import { useMobileNav } from '../contexts/MobileNavContext';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, logout } = useAuth();
  const { toggle } = useMobileNav();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user.name;

  return (
    <header className="app-header z-50 flex h-16 items-center gap-3 border-b border-outline-variant/40 bg-background px-4 sm:px-6">
      <button
        type="button"
        onClick={toggle}
        aria-label="Open navigation menu"
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-outline-variant/30 bg-surface-container-high text-on-surface lg:hidden"
      >
        <span className="material-symbols-outlined text-[22px]">menu</span>
      </button>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label="Account menu"
            className="group flex cursor-pointer items-center gap-2 rounded-lg p-1.5 transition-all hover:bg-surface-container-high sm:gap-3 sm:px-2 sm:py-2"
          >
            {user.image ? (
              <img
                src={user.image}
                alt={displayName}
                className="h-9 w-9 rounded-full border-2 border-primary/30 object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-tertiary text-sm font-bold text-on-primary">
                {getInitials(displayName)}
              </div>
            )}

            <div className="hidden min-w-0 flex-col items-start md:flex">
              <span className="max-w-[160px] truncate text-sm font-semibold text-on-surface lg:max-w-none">
                {displayName}
              </span>
              <span className="max-w-[160px] truncate text-xs text-on-surface-variant lg:max-w-none">
                {user.email}
              </span>
            </div>

            <span className="material-symbols-outlined hidden text-sm text-on-surface-variant transition-transform group-hover:text-primary sm:inline">
              {showDropdown ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-[min(18rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container shadow-2xl">
              <div className="border-b border-outline-variant/20 bg-gradient-to-br from-primary/10 to-tertiary/10 p-4">
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={displayName}
                      className="h-12 w-12 rounded-full border-2 border-primary/50 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-tertiary text-lg font-bold text-on-primary">
                      {getInitials(displayName)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-on-surface">{displayName}</p>
                    <p className="truncate text-xs text-on-surface-variant">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <a
                  href={identityAccountUrl()}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-on-surface transition-colors hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined text-sm">manage_accounts</span>
                  <span className="text-sm font-medium">Manage account</span>
                </a>
                <button
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
