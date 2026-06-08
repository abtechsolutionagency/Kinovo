import mongoose from 'mongoose';

const inviteCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    maxUses: { type: Number, default: 100 },
    usesCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

inviteCodeSchema.methods.isValid = function () {
  return this.active && this.usesCount < this.maxUses;
};

export const InviteCode =
  mongoose.models.InviteCode || mongoose.model('InviteCode', inviteCodeSchema);

export async function seedDefaultInviteCode() {
  const code = (process.env.DEFAULT_INVITE_CODE || 'KINOVO2025').toUpperCase();
  const existing = await InviteCode.findOne({ code });
  if (!existing) {
    await InviteCode.create({ code, maxUses: 1000, usesCount: 0, active: true });
    console.log(`Seeded invite code: ${code}`);
  }
}
