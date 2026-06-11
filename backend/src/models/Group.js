import mongoose from 'mongoose';

const groupMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const groupSchema = new mongoose.Schema(
  {
    destinationId: { type: String, required: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date },
    maxMembers: { type: Number, default: 20, min: 2, max: 100 },
    image: { type: String, default: '' },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: { type: [groupMemberSchema], default: [] },
  },
  { timestamps: true }
);

groupSchema.index({ destinationId: 1 });
groupSchema.index({ creator: 1 });

function resolveUserId(userRef) {
  return userRef?._id?.toString() || userRef?.toString();
}

groupSchema.methods.isMember = function (userId) {
  const id = userId.toString();
  if (resolveUserId(this.creator) === id) return true;
  return this.members.some((m) => resolveUserId(m.user) === id);
};

groupSchema.methods.memberCount = function () {
  const uniqueMembers = new Set([
    resolveUserId(this.creator),
    ...this.members.map((m) => resolveUserId(m.user)),
  ]);
  return uniqueMembers.size;
};

groupSchema.methods.toListJSON = function (currentUserId) {
  return {
    id: this._id.toString(),
    destinationId: this.destinationId,
    title: this.title,
    description: this.description,
    date: this.date?.toISOString?.()?.split('T')[0] || null,
    maxMembers: this.maxMembers,
    memberCount: this.memberCount(),
    image: this.image,
    isMember: currentUserId ? this.isMember(currentUserId) : false,
    createdAt: this.createdAt,
  };
};

groupSchema.methods.toDetailJSON = function (currentUserId) {
  const creator = this.creator?.toDiscoverJSON?.() || this.creator;
  const members = (this.members || [])
    .map((m) => {
      const user = m.user?.toDiscoverJSON?.() || m.user;
      return user ? { ...user, joinedAt: m.joinedAt } : null;
    })
    .filter(Boolean);

  if (creator && !members.some((m) => m.id === creator.id)) {
    members.unshift({ ...creator, joinedAt: this.createdAt });
  }

  return {
    ...this.toListJSON(currentUserId),
    creator,
    members,
  };
};

export const Group = mongoose.models.Group || mongoose.model('Group', groupSchema);
