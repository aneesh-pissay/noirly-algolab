import { randomUUID } from "node:crypto";
import NextAuth from "next-auth";
import { withDb } from "@/lib/mongodb";
import { isSessionRevoked, revokeSession } from "@/src/server/auth/revoked-sessions";
import { AccountLinkError, linkOrCreateUser } from "@/src/server/auth/link-user";
import { assertProductionAuthConfig } from "@/src/server/auth/config";

const issuer = process.env.AUTH_NOIRLY_ISSUER ?? "http://localhost:3000";

if (process.env.NODE_ENV === "production") {
  assertProductionAuthConfig(process.env, issuer);
}

/**
 * Localhost cookies are not port-scoped. Sibling Noirly apps (Flow, Ledger, …)
 * all default to `authjs.session-token`, so AlgoLab would try to decrypt another
 * app's JWT (`JWTSessionError` / "no matching decryption secret"). Unique names
 * in development keep sessions isolated; production uses Auth.js defaults.
 */
const localCookies =
  process.env.NODE_ENV === "development"
    ? {
        sessionToken: { name: "authjs.algolab.session-token" },
        callbackUrl: { name: "authjs.algolab.callback-url" },
        csrfToken: { name: "authjs.algolab.csrf-token" },
        pkceCodeVerifier: { name: "authjs.algolab.pkce.code_verifier" },
        state: { name: "authjs.algolab.state" },
        nonce: { name: "authjs.algolab.nonce" },
      }
    : undefined;

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  ...(localCookies ? { cookies: localCookies } : {}),
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    {
      id: "noirly",
      name: "Noirly",
      type: "oidc",
      issuer,
      clientId: process.env.AUTH_NOIRLY_CLIENT_ID,
      clientSecret: process.env.AUTH_NOIRLY_CLIENT_SECRET,
      // Auth.js defaults to ["pkce"] only; Identity requires `state`.
      checks: ["pkce", "state", "nonce"],
      client: {
        token_endpoint_auth_method: "client_secret_post",
      },
      authorization: {
        params: {
          scope: "openid profile email offline_access",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: typeof profile.name === "string" ? profile.name : null,
          email: typeof profile.email === "string" ? profile.email : null,
          image: typeof profile.picture === "string" ? profile.picture : null,
        };
      },
    },
  ],
  callbacks: {
    /**
     * Maps the Identity account onto an AlgoLab user (linking an existing
     * account by verified email) before any session exists. The id rides on
     * the `user` object, which Auth.js hands to `jwt` next.
     */
    async signIn({ user, profile }) {
      // The Identity subject comes from the profile. `user.id` is NOT it:
      // Auth.js replaces it with a fresh random UUID on every sign-in.
      const sub = typeof profile?.sub === "string" ? profile.sub : null;
      if (!sub) return false;
      try {
        const doc = await withDb(() =>
          linkOrCreateUser({
            sub,
            email: user.email ?? null,
            emailVerified: profile?.email_verified === true || String(profile?.email_verified) === "true",
            name: user.name ?? null,
            image: user.image ?? null,
          }),
        );
        (user as { appUserId?: string }).appUserId = String(doc._id);
        return true;
      } catch (error) {
        if (error instanceof AccountLinkError) return `/login?error=${error.code}`;
        throw error;
      }
    },
    async jwt({ token, user, profile }) {
      if (user?.id) {
        token.userId = (user as { appUserId?: string }).appUserId;
        // A fresh id per sign-in, so sign-out can end exactly this session.
        token.sid = randomUUID();
      }
      if (profile && typeof profile.sub === "string") {
        token.identitySub = profile.sub;
      }
      // Without an AlgoLab user there is nothing to show; sign in again.
      if (typeof token.userId !== "string") return null;
      const sid = typeof token.sid === "string" ? token.sid : randomUUID();
      token.sid = sid;

      // JWT sessions are stateless and the cookie is re-issued on every
      // response — a prefetch that lands after sign-out sets it again. Reject
      // sessions that signed out; returning null makes Auth.js clear the cookie.
      if (await isSessionRevoked(sid)) return null;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.identitySub = String(token.identitySub ?? token.sub ?? "");
      }
      return session;
    },
  },
  events: {
    async signOut(message) {
      if ("token" in message && typeof message.token?.sid === "string") {
        await revokeSession(message.token.sid);
      }
    },
  },
});
