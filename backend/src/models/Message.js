import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: { type: String, required: true, trim: true, maxlength: 5000 },
    translatedText: { type: String, default: null },
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: -1 });

messageSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    conversationId: this.conversation.toString(),
    senderId: this.sender?._id?.toString() || this.sender?.toString(),
    text: this.text,
    translated: this.translatedText,
    timestamp: this.createdAt?.toISOString?.() || this.createdAt,
    createdAt: this.createdAt,
  };
};

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
