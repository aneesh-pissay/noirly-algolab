/** Messages between the sign-in popup and the page that opened it. */
export const POPUP_NAME = 'noirly-identity';
export const AUTH_MESSAGE = 'noirly-auth';
export const AUTH_ERROR_MESSAGE = 'noirly-auth-error';
export const AUTH_STORAGE_KEY = 'noirly-auth';

export interface AuthPayload {
  type: typeof AUTH_MESSAGE | typeof AUTH_ERROR_MESSAGE;
  next?: string;
  error?: string;
  t?: number;
}
