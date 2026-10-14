'use client';

import { useEffect } from 'react';
import { AUTH_ERROR_MESSAGE, AUTH_STORAGE_KEY, POPUP_NAME, type AuthPayload } from './popup-protocol';

/**
 * A refused sign-in (e.g. account linking) lands on /login?error=… inside the
 * popup. Hand the error to the page that opened it and close, so the learner
 * sees it where they clicked instead of in a stray popup window.
 */
export function PopupErrorRelay({ error }: { error: string }) {
  useEffect(() => {
    if (window.name !== POPUP_NAME || !window.opener || window.opener.closed) return;
    const payload: AuthPayload = { type: AUTH_ERROR_MESSAGE, error, t: Date.now() };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
    window.opener.postMessage(payload, window.location.origin);
    window.close();
  }, [error]);
  return null;
}
