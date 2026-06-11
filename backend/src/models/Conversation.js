import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastReadAt: { type: Date, default: null },
    unreadCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [participantSchema],
      validate: {
        validator: (v) => v.length === 2,
        message: 'Conversation must have exactly 2 participants',
      },
    },
    participantKey: { type: String, unique: true, required: true },
    lastMessage: { type: String, default: '' },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessageSender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

conversationSchema.index({ 'participants.user': 1 });
conversationSchema.index({ lastMessageAt: -1 });

conversationSchema.statics.buildParticipantKey = function (userIdA, userIdB) {
  return [userIdA.toString(), userIdB.toString()].sort().join(':');
};

conversationSchema.methods.getOtherParticipant = function (currentUserId) {
  const id = currentUserId.toString();
  const entry = this.participants.find((p) => {
    const pid = p.user?._id?.toString() || p.user?.toString();
    return pid !== id;
  });
  return entry?.user;
};

conversationSchema.methods.unreadCountFor = function (userId) {
  const id = userId.toString();
  const participant = this.participants.find((p) => {
    const pid = p.user?._id?.toString() || p.user?.toString();
    return pid === id;
  });
  return participant?.unreadCount || 0;
};

conversationSchema.methods.toListJSON = function (currentUserId, { online = false } = {}) {
  const other = this.getOtherParticipant(currentUserId);
  const otherUser = other?.toDiscoverJSON?.() || other;

  return {
    id: this._id.toString(),
    userId: otherUser?.id || (other?._id?.toString() || other?.toString()),
    userName: otherUser?.name || 'Unknown',
    userAvatar: otherUser?.avatar || '',
    lastMessage: this.lastMessage || '',
    timestamp: this.lastMessageAt?.toISOString?.() || this.createdAt?.toISOString?.(),
    unread: this.unreadCountFor(currentUserId),
    online,
  };
};

export const Conversation =
  mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
