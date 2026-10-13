/**
 * Production guard, same rules as Noirly Flow: a short, low-entropy or
 * placeholder AUTH_SECRET makes every session cookie forgeable, and a
 * plain-HTTP issuer exposes the token exchange.
 */
export function assertProductionAuthConfig(env: Record<string, string | undefined>, issuer: string): void {
  const secret = env.AUTH_SECRET;
  if (
    !secret ||
    Buffer.byteLength(secret) < 32 ||
    new Set(secret).size < 10 ||
    /change.?me|replace.?(me|with)|placeholder|random.?data|example|your.?secret/i.test(secret)
  ) {
    throw new Error('AUTH_SECRET must be a unique random secret of at least 32 bytes');
  }
  if (!issuer.startsWith('https://')) throw new Error('AUTH_NOIRLY_ISSUER must use HTTPS in production');
}
