import { Conversation } from '../models/Conversation.js';
import { Connection } from '../models/Connection.js';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

export async function assertUsersConnected(userId, targetUserId) {
  const connection = await Connection.findOne({
    status: 'accepted',
    $or: [
      { requester: userId, recipient: targetUserId },
      { requester: targetUserId, recipient: userId },
    ],
  });

  if (!connection) {
    throw new AppError(
      'You must be connected with this user before messaging',
      403,
      'Forbidden'
    );
  }
}

export async function findOrCreateConversation(userId, targetUserId) {
  const participantKey = Conversation.buildParticipantKey(userId, targetUserId);

  let conversation = await Conversation.findOne({ participantKey }).populate(
    'participants.user lastMessageSender'
  );

  if (conversation) return conversation;

  conversation = await Conversation.create({
    participantKey,
    participants: [{ user: userId }, { user: targetUserId }],
    lastMessage: '',
    lastMessageAt: new Date(),
  });

  await conversation.populate('participants.user lastMessageSender');
  return conversation;
}

export async function getConversationForUser(conversationId, userId) {
  const conversation = await Conversation.findById(conversationId).populate(
    'participants.user lastMessageSender'
  );

  if (!conversation) {
    throw new AppError('Conversation not found', 404, 'Not found');
  }

  const isParticipant = conversation.participants.some((p) => {
    const pid = p.user?._id?.toString() || p.user?.toString();
    return pid === userId.toString();
  });

  if (!isParticipant) {
    throw new AppError('You are not a participant in this conversation', 403, 'Forbidden');
  }

  return conversation;
}

export async function validateTargetUser(targetUserId, currentUserId) {
  if (targetUserId === currentUserId.toString()) {
    throw new AppError('Cannot message yourself', 400, 'Validation error');
  }

  const target = await User.findById(targetUserId);
  if (!target) {
    throw new AppError('User not found', 404, 'Not found');
  }

  return target;
}
