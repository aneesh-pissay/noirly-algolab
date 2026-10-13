import { NextRequest, NextResponse } from "next/server";

function configuredOrigin(value: string | undefined): string {
  try { return value ? new URL(value).origin : ""; } catch { return ""; }
}

/** Per-request nonce + CSP and the usual hardening headers (same policy as Noirly Flow). */
export function securePageResponse(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV !== "production";
  const identity = configuredOrigin(process.env.AUTH_NOIRLY_ISSUER);
  const policy = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data: https://fonts.gstatic.com",
    `connect-src 'self' ${identity}${isDev ? " ws: http://localhost:*" : ""}`,
    "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'",
    `form-action 'self' ${identity}`,
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);
  headers.set("Content-Security-Policy", policy);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", policy);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Cache-Control", "private, no-store");
  if (!isDev) response.headers.set("Strict-Transport-Security", "max-age=31536000");
  return response;
}

/** Browser credential mutations must originate in this app. */
export function rejectCrossOriginMutation(request: NextRequest, configuredUrl?: string) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return null;
  const origin = request.headers.get("origin");
  const expected = configuredOrigin(configuredUrl) || request.nextUrl.origin;
  if (origin && origin !== expected) return NextResponse.json({ error: "csrf_failed" }, { status: 403 });
  if (request.headers.get("sec-fetch-site") === "cross-site") return NextResponse.json({ error: "csrf_failed" }, { status: 403 });
  return null;
}
