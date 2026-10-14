import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      /** AlgoLab's MongoDB user id. */
      id: string;
      /** Noirly Identity subject. */
      identitySub: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    identitySub?: string;
    sid?: string;
  }
}
