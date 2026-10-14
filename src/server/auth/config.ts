/**
 * Production guard, same rules as Noirly Flow: a short, low-entropy or
 * placeholder AUTH_SECRET makes every session cookie forgeable, and a
 * plain-HTTP issuer exposes the token exchange.
 */
export function assertProductionAuthConfig(env: Record<string, string | undefined>, issuer: string): void {
  // Messages name the variable and the problem, never the value: these fire
  // at build time on Vercel, and the build log is the first place to look.
  const secret = env.AUTH_SECRET;
  const weak = 'AUTH_SECRET must be a unique random secret of at least 32 bytes';
  if (!secret) throw new Error(`${weak} (it is not set; generate one with \`openssl rand -base64 48\`)`);
  if (Buffer.byteLength(secret) < 32) throw new Error(`${weak} (it is ${Buffer.byteLength(secret)} bytes)`);
  if (new Set(secret).size < 10 || /change.?me|replace.?(me|with)|placeholder|random.?data|example|your.?secret/i.test(secret)) {
    throw new Error(`${weak} (it looks like a placeholder)`);
  }
  if (!env.AUTH_NOIRLY_ISSUER) throw new Error('AUTH_NOIRLY_ISSUER must be set to the Noirly Identity URL in production');
  if (!issuer.startsWith('https://')) throw new Error('AUTH_NOIRLY_ISSUER must use HTTPS in production');
}
