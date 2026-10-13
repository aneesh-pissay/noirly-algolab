import { describe, expect, it, vi } from 'vitest';

vi.mock('@/models/User', () => ({ default: {} }));
vi.mock('@/lib/user-collections', () => ({ initializeUserCollections: vi.fn() }));

import { AccountLinkError, baseUsername, linkOrCreateUser, type IdentityProfile, type LinkDeps } from './link-user';

type Row = { _id: string; username: string; email: string; identitySub?: string; isVerified?: boolean };

function memoryDeps(rows: Row[]): LinkDeps & { rows: Row[]; initialized: string[] } {
  const initialized: string[] = [];
  return {
    rows,
    initialized,
    findBySub: async (sub) => rows.find((r) => r.identitySub === sub) ?? null,
    findByEmail: async (email) => rows.find((r) => r.email === email) ?? null,
    link: async (userId, sub) => {
      const row = rows.find((r) => r._id === userId && (!r.identitySub || r.identitySub === sub));
      if (!row) return null;
      row.identitySub = sub;
      row.isVerified = true;
      return row;
    },
    usernameTaken: async (username) => rows.some((r) => r.username === username),
    create: async (input) => {
      if (rows.some((r) => r.identitySub === input.identitySub)) throw Object.assign(new Error('dup'), { code: 11000 });
      const row = { _id: `u${rows.length + 1}`, ...input };
      rows.push(row);
      return row;
    },
    initializeCollections: async (userId) => {
      initialized.push(userId);
    },
  };
}

const profile = (overrides: Partial<IdentityProfile> = {}): IdentityProfile => ({
  sub: '65f000000000000000000001',
  email: 'ada@example.com',
  emailVerified: true,
  name: 'Ada Lovelace',
  image: null,
  ...overrides,
});

describe('linkOrCreateUser', () => {
  it('returns the user already linked to the Identity subject', async () => {
    const deps = memoryDeps([{ _id: 'u1', username: 'ada', email: 'ada@example.com', identitySub: profile().sub }]);
    const user = await linkOrCreateUser(profile({ email: 'changed@example.com' }), deps);
    expect(user._id).toBe('u1');
    expect(deps.rows).toHaveLength(1);
  });

  it('links an existing local account by verified email, keeping its id', async () => {
    const deps = memoryDeps([{ _id: 'legacy', username: 'ada', email: 'ada@example.com', isVerified: false }]);
    const user = await linkOrCreateUser(profile({ email: 'ADA@example.com ' }), deps);
    expect(user._id).toBe('legacy');
    expect(deps.rows[0]).toMatchObject({ identitySub: profile().sub, isVerified: true });
    expect(deps.rows).toHaveLength(1);
  });

  it('refuses to link when Identity has not verified the email', async () => {
    const deps = memoryDeps([{ _id: 'legacy', username: 'ada', email: 'ada@example.com' }]);
    await expect(linkOrCreateUser(profile({ emailVerified: false }), deps)).rejects.toMatchObject({ code: 'email_unverified' });
    expect(deps.rows[0].identitySub).toBeUndefined();
  });

  it('refuses an email whose account is linked to another Identity user', async () => {
    const deps = memoryDeps([{ _id: 'u1', username: 'ada', email: 'ada@example.com', identitySub: 'someone-else' }]);
    await expect(linkOrCreateUser(profile(), deps)).rejects.toBeInstanceOf(AccountLinkError);
  });

  it('creates a new user with a unique username and initializes collections', async () => {
    const deps = memoryDeps([{ _id: 'u1', username: 'ada', email: 'other@example.com' }]);
    const user = await linkOrCreateUser(profile(), deps);
    expect(user.username).toMatch(/^ada-\d{4}$/);
    expect(deps.rows[1]).toMatchObject({ email: 'ada@example.com', identitySub: profile().sub, firstName: 'Ada', lastName: 'Lovelace' });
    expect(deps.initialized).toEqual([String(user._id)]);
  });

  it('creates an unverified user when Identity has not verified a new email', async () => {
    const deps = memoryDeps([]);
    await linkOrCreateUser(profile({ emailVerified: false }), deps);
    expect(deps.rows[0].isVerified).toBe(false);
  });

  it('requires an email', async () => {
    await expect(linkOrCreateUser(profile({ email: null }), memoryDeps([]))).rejects.toMatchObject({ code: 'missing_email' });
  });

  it('returns the winner when two first sign-ins race', async () => {
    const deps = memoryDeps([]);
    const winner = { _id: 'w', username: 'ada', email: 'ada@example.com', identitySub: profile().sub };
    let calls = 0;
    deps.findBySub = async () => (calls++ === 0 ? null : winner);
    deps.create = async () => {
      throw Object.assign(new Error('dup'), { code: 11000 });
    };
    expect((await linkOrCreateUser(profile(), deps))._id).toBe('w');
  });
});

describe('baseUsername', () => {
  it('derives a handle from the email local part', () => {
    expect(baseUsername({ email: 'Ada.Lovelace+x@example.com', name: null })).toBe('ada.lovelacex');
  });
  it('pads very short handles', () => {
    expect(baseUsername({ email: 'a@example.com', name: null })).toBe('learnera');
  });
});
