import User, { type IUser } from '@/models/User';
import { initializeUserCollections } from '@/lib/user-collections';

export interface IdentityProfile {
  sub: string;
  email: string | null;
  emailVerified: boolean;
  name: string | null;
  image: string | null;
}

/** Thrown when a sign-in must be refused; Auth.js turns it into AccessDenied. */
export class AccountLinkError extends Error {
  constructor(public code: 'missing_email' | 'email_unverified' | 'already_linked') {
    super(code);
    this.name = 'AccountLinkError';
  }
}

type LinkedUser = Pick<IUser, 'username' | 'email'> & { _id: unknown };

export interface LinkDeps {
  findBySub(sub: string): Promise<LinkedUser | null>;
  findByEmail(email: string): Promise<(LinkedUser & { identitySub?: string }) | null>;
  /** Sets `identitySub` unless another subject claimed the account meanwhile; `replacing` may be overwritten. */
  link(userId: string, sub: string, image: string | null, replacing?: string): Promise<LinkedUser | null>;
  usernameTaken(username: string): Promise<boolean>;
  create(input: { username: string; email: string; identitySub: string; isVerified: boolean; avatar?: string; firstName?: string; lastName?: string }): Promise<LinkedUser>;
  initializeCollections(userId: string): Promise<void>;
}

const mongoDeps: LinkDeps = {
  findBySub: (sub) => User.findOne({ identitySub: sub }),
  findByEmail: (email) => User.findOne({ email }),
  link: (userId, sub, image, replacing) =>
    User.findOneAndUpdate(
      // Only claim an account no other Identity user has linked meanwhile.
      {
        _id: userId,
        $or: [
          { identitySub: { $exists: false } },
          { identitySub: null },
          { identitySub: sub },
          ...(replacing ? [{ identitySub: replacing }] : []),
        ],
      },
      { $set: { identitySub: sub, isVerified: true, ...(image ? { avatar: image } : {}) } },
      { new: true },
    ),
  usernameTaken: async (username) => Boolean(await User.exists({ username })),
  create: (input) => User.create(input),
  initializeCollections: initializeUserCollections,
};

/**
 * Noirly Identity subjects are Mongo ObjectIds (24 hex characters). Before
 * the fix in auth.ts, sign-in stored Auth.js's per-sign-in random UUID
 * instead, so every later sign-in looked like a different Noirly account.
 * A UUID-shaped `identitySub` is that stale value, never a real subject, and
 * may be replaced (still only with a verified email).
 */
export function isStaleIdentitySub(sub: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sub);
}

function isDuplicateKey(error: unknown): boolean {
  return (error as { code?: unknown })?.code === 11000;
}

/** A readable, unique-ish handle from the profile: letters, digits, `.`, `_`, `-`; 3–30 chars. */
export function baseUsername(profile: Pick<IdentityProfile, 'name' | 'email'>): string {
  const source = profile.email?.split('@')[0] || profile.name || 'learner';
  const cleaned = source
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9._-]+/g, '')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, 24);
  return cleaned.length >= 3 ? cleaned : `learner${cleaned}`.slice(0, 24);
}

async function pickUsername(profile: IdentityProfile, deps: LinkDeps): Promise<string> {
  const base = baseUsername(profile);
  if (!(await deps.usernameTaken(base))) return base;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = `${base}-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!(await deps.usernameTaken(candidate))) return candidate;
  }
  return `${base}-${profile.sub.replace(/[^a-z0-9]/gi, '').slice(-5).toLowerCase()}`;
}

function splitName(name: string | null): { firstName?: string; lastName?: string } {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return {};
  return { firstName: parts[0], ...(parts.length > 1 ? { lastName: parts.slice(1).join(' ') } : {}) };
}

/**
 * Maps a Noirly Identity account onto an AlgoLab user, keeping existing
 * progress attached to the same `_id`:
 *
 * 1. Already linked (`identitySub === sub`) → that user.
 * 2. A local account with the same email → linked, but only when Identity
 *    says the address is verified (otherwise anyone could register the email
 *    on Identity and take over the AlgoLab account).
 * 3. Otherwise a new user, with the usual per-user collections.
 */
export async function linkOrCreateUser(profile: IdentityProfile, deps: LinkDeps = mongoDeps): Promise<LinkedUser> {
  const existing = await deps.findBySub(profile.sub);
  if (existing) return existing;

  const email = profile.email?.trim().toLowerCase();
  if (!email) throw new AccountLinkError('missing_email');

  const local = await deps.findByEmail(email);
  if (local) {
    const stale = local.identitySub && isStaleIdentitySub(local.identitySub) ? local.identitySub : undefined;
    if (local.identitySub && local.identitySub !== profile.sub && !stale) throw new AccountLinkError('already_linked');
    if (!profile.emailVerified) throw new AccountLinkError('email_unverified');
    const linked = await deps.link(String(local._id), profile.sub, profile.image, stale);
    if (!linked) throw new AccountLinkError('already_linked');
    return linked;
  }

  try {
    const created = await deps.create({
      username: await pickUsername(profile, deps),
      email,
      identitySub: profile.sub,
      isVerified: profile.emailVerified,
      ...(profile.image ? { avatar: profile.image } : {}),
      ...splitName(profile.name),
    });
    try {
      await deps.initializeCollections(String(created._id));
    } catch (error) {
      // Progress and settings are created on demand too; don't block sign-in.
      console.error('initializeUserCollections failed on first sign-in:', error);
    }
    return created;
  } catch (error) {
    // Two first sign-ins racing: the other one created the user.
    if (isDuplicateKey(error)) {
      const raced = await deps.findBySub(profile.sub);
      if (raced) return raced;
    }
    throw error;
  }
}
