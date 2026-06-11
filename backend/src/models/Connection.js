import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });
connectionSchema.index({ recipient: 1, status: 1 });
connectionSchema.index({ requester: 1, status: 1 });

connectionSchema.methods.toJSON = function (currentUserId) {
  const isRequester = this.requester._id
    ? this.requester._id.toString() === currentUserId
    : this.requester.toString() === currentUserId;

  const otherUser = isRequester ? this.recipient : this.requester;

  return {
    id: this._id.toString(),
    status: this.status,
    direction: isRequester ? 'sent' : 'received',
    user: otherUser?.toDiscoverJSON?.() || otherUser,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export const Connection =
  mongoose.models.Connection || mongoose.model('Connection', connectionSchema);
