import { Schema, models, model, type Model } from 'mongoose';

/**
 * Sessions ended by sign-out. Auth.js JWT sessions are stateless, so without
 * this a session cookie that comes back after sign-out (a late prefetch
 * response re-sets it) would still be accepted. Rows expire on their own once
 * the session they record could no longer be valid anyway.
 */
export interface RevokedSessionDocument {
  sid: string;
  expiresAt: Date;
}

const revokedSessionSchema = new Schema<RevokedSessionDocument>({
  sid: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});

export const RevokedSession: Model<RevokedSessionDocument> =
  (models.RevokedSession as Model<RevokedSessionDocument>) ||
  model<RevokedSessionDocument>('RevokedSession', revokedSessionSchema, 'revoked_sessions');
