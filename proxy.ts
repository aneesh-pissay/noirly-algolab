import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { consumeRateLimit } from "@/src/server/security/rate-limit";
import { securePageResponse, rejectCrossOriginMutation } from "@/src/server/security/request";
import { decidePageRoute } from "@/src/server/auth/routes";

export const proxy = auth(async (request) => {
  const { pathname, search, searchParams } = request.nextUrl;
  if (pathname.endsWith(".map")) return new NextResponse(null, { status: 404 });

  const api = pathname.startsWith("/api/");
  const authApi = pathname.startsWith("/api/auth/");
  const webhook = pathname === "/api/identity/account-deleted";
  if (api && !authApi && !webhook) {
    // Bearer (mobile) callers authenticate per request with an Identity access
    // token and carry no ambient cookie, so CSRF checks apply to cookies only.
    const bearer = /^Bearer\s+\S+$/i.test(request.headers.get("authorization") ?? "");
    if (!bearer) {
      const rejection = rejectCrossOriginMutation(request, process.env.AUTH_URL);
      if (rejection) return rejection;
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method) && request.headers.get("x-noirly-csrf") !== "1") {
        return NextResponse.json({ error: "csrf_failed" }, { status: 403 });
      }
    }
    try {
      const ip = request.headers.get(process.env.TRUSTED_CLIENT_IP_HEADER ?? "x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
      const result = await consumeRateLimit(`algolab-api:${ip}`, 300, 60);
      if (!result.allowed) return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } });
    } catch {
      return NextResponse.json({ error: "temporarily_unavailable" }, { status: 503 });
    }
  }

  const decision = decidePageRoute(pathname, search, Boolean(request.auth), searchParams.get("next"));
  if (decision.type === "redirect") {
    return NextResponse.redirect(new URL(decision.location, request.nextUrl.origin));
  }
  return securePageResponse(request);
});

export const config = {
  matcher: [
    "/api/:path*",
    "/_next/:path*.map",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
