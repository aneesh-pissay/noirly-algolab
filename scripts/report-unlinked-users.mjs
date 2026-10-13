#!/usr/bin/env node
/**
 * Dry run: how many AlgoLab users have not signed in through Noirly Identity
 * yet (no `identitySub`). Read-only — changes nothing.
 *
 *   MONGODB_URI=... pnpm report:unlinked-users
 *
 * Run it before turning off anything that only legacy accounts can use.
 */
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI is required');
  process.exit(1);
}

await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
const users = mongoose.connection.db.collection('users');
const unlinkedFilter = { $or: [{ identitySub: { $exists: false } }, { identitySub: null }] };

const [total, unlinked, unlinkedVerified, unlinkedWithProgress] = await Promise.all([
  users.countDocuments({}),
  users.countDocuments(unlinkedFilter),
  users.countDocuments({ ...unlinkedFilter, isVerified: true }),
  mongoose.connection.db.collection('user_curriculum_progress').countDocuments({
    userId: { $in: await users.distinct('_id', unlinkedFilter) },
    'completedLessons.0': { $exists: true },
  }),
]);

console.log(`Users:                           ${total}`);
console.log(`Linked to Noirly Identity:       ${total - unlinked}`);
console.log(`Not linked yet:                  ${unlinked}`);
console.log(`  …with a verified email:        ${unlinkedVerified}`);
console.log(`  …with completed lessons:       ${unlinkedWithProgress}`);
console.log('');
console.log('Unlinked users are linked automatically, by verified email, the first time they use "Noirly Login".');

await mongoose.disconnect();
