/**
 * Fetch helper for AlgoLab's own API. The session is an httpOnly Auth.js
 * cookie, so there is no token to attach; mutations carry `X-Noirly-CSRF: 1`,
 * which proxy.ts requires for cookie-authenticated writes.
 */
export class ApiRequestError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export async function apiFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  if (init.body !== undefined && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (!SAFE_METHODS.has(method)) headers.set('X-Noirly-CSRF', '1');
  return fetch(input, { ...init, method, headers, credentials: 'same-origin', cache: init.cache ?? 'no-store' });
}

/** JSON in, JSON out; throws ApiRequestError with the server's `error` message. */
export async function apiJson<T>(input: string, init: RequestInit = {}, fallbackError = 'Request failed'): Promise<T> {
  const response = await apiFetch(input, init);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiRequestError(response.status, typeof body.error === 'string' ? body.error : fallbackError);
  }
  return response.json() as Promise<T>;
}
