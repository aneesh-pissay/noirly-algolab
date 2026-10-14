import { createHash } from 'node:crypto';
import { Schema, model, models, type Model } from 'mongoose';
import connectDB from '@/lib/mongodb';

interface CounterDocument {
  _id: string;
  count: number;
  expiresAt: Date;
}

const schema = new Schema<CounterDocument>({
  _id: { type: String, required: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});
const Counter: Model<CounterDocument> =
  (models.SecurityRateCounter as Model<CounterDocument>) || model<CounterDocument>('SecurityRateCounter', schema);

/** Atomic, shared fixed-window counters. No raw IP addresses/emails are persisted. */
export async function consumeRateLimit(key: string, limit: number, seconds: number) {
  await connectDB();
  await Counter.init();
  const window = Math.floor(Date.now() / (seconds * 1000));
  const expiresAt = new Date((window + 1) * seconds * 1000);
  const _id = createHash('sha256').update(`${key}:${seconds}:${window}`).digest('hex');
  let row;
  try {
    row = await Counter.findOneAndUpdate({ _id }, { $inc: { count: 1 }, $setOnInsert: { expiresAt } }, { upsert: true, returnDocument: 'after' }).lean();
  } catch (error) {
    if ((error as { code?: number }).code !== 11000) throw error;
    row = await Counter.findOneAndUpdate({ _id }, { $inc: { count: 1 } }, { returnDocument: 'after' }).lean();
  }
  const count = Number(row?.count ?? limit + 1);
  return { allowed: count <= limit, remaining: Math.max(0, limit - count), retryAfterSeconds: Math.max(1, Math.ceil((expiresAt.getTime() - Date.now()) / 1000)) };
}
