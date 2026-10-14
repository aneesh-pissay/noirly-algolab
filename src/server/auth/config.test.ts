import { describe, expect, it } from 'vitest';
import { assertProductionAuthConfig } from './config';

const strong = 'k3Jx9QpL2mZr7VtB8nYw4HcF6dGs1aEu';
const issuer = 'https://identity.noirly.dev';
const env = (secret: string | undefined) => ({ AUTH_SECRET: secret, AUTH_NOIRLY_ISSUER: issuer });

describe('assertProductionAuthConfig', () => {
  it('accepts a strong secret and an HTTPS issuer', () => {
    expect(() => assertProductionAuthConfig(env(strong), issuer)).not.toThrow();
  });
  it.each([undefined, 'short', 'a'.repeat(40), 'replace-with-at-least-32-chars-of-random-data'])('rejects weak secret %s', (secret) => {
    expect(() => assertProductionAuthConfig(env(secret), issuer)).toThrow(/AUTH_SECRET/);
  });
  it('rejects a plain-HTTP issuer', () => {
    expect(() => assertProductionAuthConfig({ AUTH_SECRET: strong, AUTH_NOIRLY_ISSUER: 'http://localhost:3000' }, 'http://localhost:3000')).toThrow(/HTTPS/);
  });
  it('says which problem it found, without echoing the secret', () => {
    expect(() => assertProductionAuthConfig(env(undefined), issuer)).toThrow(/not set/);
    expect(() => assertProductionAuthConfig(env('short-secret'), issuer)).toThrow(/12 bytes/);
    const placeholder = 'replace-with-at-least-32-chars-of-random-data';
    expect(() => assertProductionAuthConfig(env(placeholder), issuer)).toThrow(/placeholder/);
    expect(() => assertProductionAuthConfig(env(placeholder), issuer)).not.toThrow(new RegExp(placeholder));
  });
  it('rejects a missing issuer instead of the localhost default', () => {
    expect(() => assertProductionAuthConfig({ AUTH_SECRET: strong }, 'http://localhost:3000')).toThrow(/must be set/);
  });
});
