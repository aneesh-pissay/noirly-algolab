import { describe, expect, it } from 'vitest';
import { assertProductionAuthConfig } from './config';

const strong = 'k3Jx9QpL2mZr7VtB8nYw4HcF6dGs1aEu';

describe('assertProductionAuthConfig', () => {
  it('accepts a strong secret and an HTTPS issuer', () => {
    expect(() => assertProductionAuthConfig({ AUTH_SECRET: strong }, 'https://identity.noirly.dev')).not.toThrow();
  });
  it.each([undefined, 'short', 'a'.repeat(40), 'replace-with-at-least-32-chars-of-random-data'])('rejects weak secret %s', (secret) => {
    expect(() => assertProductionAuthConfig({ AUTH_SECRET: secret }, 'https://identity.noirly.dev')).toThrow(/AUTH_SECRET/);
  });
  it('rejects a plain-HTTP issuer', () => {
    expect(() => assertProductionAuthConfig({ AUTH_SECRET: strong }, 'http://localhost:3000')).toThrow(/HTTPS/);
  });
});
