import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import mongoose from 'mongoose';
import { E2E_MONGODB_URI, E2E_USER, SESSION_COOKIE, STORAGE_STATE } from './env';
import { mintSession } from './session';

/**
 * 1. Empty the e2e database, so every run starts fresh.
 * 2. Create the test learner (as a first Noirly Login would).
 * 3. Save a minted session as Playwright storage state.
 */
export default async function globalSetup() {
  if (!/noirly-algolab-e2e/.test(E2E_MONGODB_URI)) {
    throw new Error(`Refusing to wipe a non-e2e database: ${E2E_MONGODB_URI}`);
  }
  const connection = await mongoose.createConnection(E2E_MONGODB_URI, { serverSelectionTimeoutMS: 5000 }).asPromise();
  for (const collection of await connection.db!.collections()) {
    await collection.deleteMany({});
  }
  await connection.db!.collection('users').insertOne({
    _id: new mongoose.Types.ObjectId(E2E_USER.userId),
    username: 'ada',
    email: E2E_USER.email,
    identitySub: E2E_USER.identitySub,
    isVerified: true,
    currentLevel: 1,
    xp: 0,
    streak: 0,
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await connection.close();

  await mkdir(dirname(STORAGE_STATE), { recursive: true });
  await writeFile(
    STORAGE_STATE,
    JSON.stringify({
      cookies: [
        {
          name: SESSION_COOKIE,
          value: await mintSession(),
          domain: 'localhost',
          path: '/',
          expires: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        },
      ],
      origins: [],
    }),
  );
}
