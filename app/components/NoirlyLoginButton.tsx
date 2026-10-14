'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogIn } from 'lucide-react';
import { cn } from '@noirly-dev/ui';
import { BusyScreen } from '@/src/components/BusyScreen';
import { loginErrorMessage } from '@/app/login/messages';
import { AUTH_ERROR_MESSAGE, AUTH_MESSAGE, AUTH_STORAGE_KEY, POPUP_NAME, type AuthPayload } from '@/app/login/popup-protocol';

function safeNext(value: string | undefined, fallback: string): string {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : fallback;
}

function takeStoredPayload(): AuthPayload | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return JSON.parse(raw) as AuthPayload;
  } catch {
    return null;
  }
}

function popupFeatures() {
  const width = 480;
  const height = 740;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));
  return `popup=yes,width=${width},height=${height},left=${left},top=${top}`;
}

/**
 * Signs in with Noirly Identity in a popup, like Noirly Flow: the page stays
 * put, and reloads into `next` once the popup reports success. If popups are
 * blocked the same URL opens in this tab instead.
 */
export function NoirlyLoginButton({ next = '/dashboard', className, size = 'lg' }: { next?: string; className?: string; size?: 'sm' | 'lg' }) {
  const target = safeNext(next, '/dashboard');
  const startUrl = `/login/popup?next=${encodeURIComponent(target)}`;
  const [waiting, setWaiting] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const doneRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    function handle(payload: AuthPayload | null) {
      if (!payload || doneRef.current) return;
      if (payload.type === AUTH_ERROR_MESSAGE) {
        setWaiting(false);
        setError(loginErrorMessage(payload.error) ?? loginErrorMessage('unknown'));
        return;
      }
      if (payload.type !== AUTH_MESSAGE) return;
      doneRef.current = true;
      setSignedIn(true);
      setWaiting(true);
      try {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      window.location.assign(safeNext(payload.next, target));
    }

    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      handle(event.data as AuthPayload | null);
    }
    function onStorage(event: StorageEvent) {
      if (event.key !== AUTH_STORAGE_KEY || !event.newValue) return;
      try {
        handle(JSON.parse(event.newValue) as AuthPayload);
      } catch {
        /* ignore */
      }
    }

    window.addEventListener('message', onMessage);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('storage', onStorage);
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [target]);

  function watch(popup: Window) {
    if (timerRef.current !== null) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      if (!popup.closed) return;
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
      timerRef.current = null;
      // The popup may have closed before its message arrived (COOP, slow opener).
      const payload = takeStoredPayload();
      if (payload?.type === AUTH_MESSAGE && !doneRef.current) {
        doneRef.current = true;
        setSignedIn(true);
        window.location.assign(safeNext(payload.next, target));
        return;
      }
      if (payload?.type === AUTH_ERROR_MESSAGE) setError(loginErrorMessage(payload.error));
      window.setTimeout(() => {
        if (!doneRef.current) setWaiting(false);
      }, 600);
    }, 300);
  }

  function open() {
    setError(null);
    doneRef.current = false;
    setSignedIn(false);
    const popup = window.open(startUrl, POPUP_NAME, popupFeatures());
    if (!popup) {
      // Blocked: sign in in this tab; popup-complete redirects instead of closing.
      // A full navigation: /login/popup is a route handler that redirects to Identity.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(startUrl);
      return;
    }
    setWaiting(true);
    popup.focus();
    watch(popup);
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {waiting ? createPortal(<BusyScreen label={signedIn ? 'Signing in to AlgoLab' : 'Waiting for Identity'} />, document.body) : null}
      <button
        type="button"
        onClick={open}
        disabled={waiting}
        className={cn('btn btn-solid w-full', size === 'lg' ? 'btn-lg' : 'btn-sm')}
      >
        <LogIn size={size === 'lg' ? 16 : 14} aria-hidden />
        {signedIn ? 'Signing in…' : waiting ? 'Waiting for Identity…' : 'Noirly Login'}
      </button>
      {error ? (
        <p role="alert" className="rounded-[var(--r-md)] bg-[var(--accent-soft)] p-3 text-sm text-[var(--text)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
