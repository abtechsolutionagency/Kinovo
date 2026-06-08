import crypto from 'crypto';
import mongoose from 'mongoose';

const passwordResetSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

passwordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export function generateResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, tokenHash };
}

export const PasswordResetToken =
  mongoose.models.PasswordResetToken ||
  mongoose.model('PasswordResetToken', passwordResetSchema);
