import mongoose from 'mongoose';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  assertUsersConnected,
  findOrCreateConversation,
  getConversationForUser,
  validateTargetUser,
} from '../services/conversationService.js';
import { isUserOnline, emitNewMessage, emitMessagesRead } from '../socket/index.js';

export async function createConversation(req, res) {
  const { targetUserId } = req.body;

  if (!targetUserId) {
    throw new AppError('targetUserId is required', 400, 'Validation error');
  }

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new AppError('Invalid target user id', 400, 'Validation error');
  }

  await validateTargetUser(targetUserId, req.user._id);
  await assertUsersConnected(req.user._id, targetUserId);

  const conversation = await findOrCreateConversation(req.user._id, targetUserId);
  const other = conversation.getOtherParticipant(req.user._id);

  return res.status(201).json({
    success: true,
    conversation: {
      id: conversation._id.toString(),
      participant: other?.toDiscoverJSON?.() || other,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
    },
    message: 'Conversation ready',
  });
}

export async function listConversations(req, res) {
  const conversations = await Conversation.find({
    'participants.user': req.user._id,
  })
    .populate('participants.user lastMessageSender')
    .sort({ lastMessageAt: -1 });

  return res.json({
    success: true,
    conversations: conversations.map((c) =>
      c.toListJSON(req.user._id, {
        online: isUserOnline(c.getOtherParticipant(req.user._id)?._id || c.getOtherParticipant(req.user._id)),
      })
    ),
    total: conversations.length,
  });
}

export async function getConversation(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid conversation id', 400, 'Validation error');
  }

  const conversation = await getConversationForUser(id, req.user._id);
  const other = conversation.getOtherParticipant(req.user._id);
  const otherId = other?._id?.toString() || other?.toString();

  return res.json({
    success: true,
    conversation: {
      id: conversation._id.toString(),
      participant: other?.toDiscoverJSON?.() || other,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
      unread: conversation.unreadCountFor(req.user._id),
      online: isUserOnline(otherId),
    },
  });
}

export async function getMessages(req, res) {
  const { id } = req.params;
  const { before, limit = 50 } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid conversation id', 400, 'Validation error');
  }

  await getConversationForUser(id, req.user._id);

  const filter = { conversation: id };
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);

  if (before) {
    if (!mongoose.Types.ObjectId.isValid(before)) {
      throw new AppError('Invalid before message id', 400, 'Validation error');
    }
    const beforeMessage = await Message.findById(before);
    if (beforeMessage) {
      filter.createdAt = { $lt: beforeMessage.createdAt };
    }
  }

  const messages = await Message.find(filter)
    .sort({ createdAt: -1 })
    .limit(limitNum)
    .populate('sender');

  const ordered = messages.reverse();

  return res.json({
    success: true,
    messages: ordered.map((m) => m.toJSON()),
    hasMore: messages.length === limitNum,
  });
}

export async function sendMessage(req, res) {
  const { id } = req.params;
  const { text } = req.body;

  if (!text?.trim()) {
    throw new AppError('Message text is required', 400, 'Validation error');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid conversation id', 400, 'Validation error');
  }

  const conversation = await getConversationForUser(id, req.user._id);

  const message = await Message.create({
    conversation: id,
    sender: req.user._id,
    text: text.trim(),
  });

  conversation.lastMessage = text.trim();
  conversation.lastMessageAt = message.createdAt;
  conversation.lastMessageSender = req.user._id;

  conversation.participants.forEach((p) => {
    const pid = p.user?._id?.toString() || p.user?.toString();
    if (pid === req.user._id.toString()) {
      p.lastReadAt = message.createdAt;
      p.unreadCount = 0;
    } else {
      p.unreadCount = (p.unreadCount || 0) + 1;
    }
  });

  await conversation.save();
  await message.populate('sender');

  const payload = message.toJSON();
  const participantIds = conversation.participants.map(
    (p) => p.user?._id?.toString() || p.user?.toString()
  );
  emitNewMessage(id, payload, participantIds);

  return res.status(201).json({
    success: true,
    message: payload,
  });
}

export async function markConversationRead(req, res) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid conversation id', 400, 'Validation error');
  }

  const conversation = await getConversationForUser(id, req.user._id);
  const readAt = new Date();

  const participant = conversation.participants.find((p) => {
    const pid = p.user?._id?.toString() || p.user?.toString();
    return pid === req.user._id.toString();
  });

  if (participant) {
    participant.lastReadAt = readAt;
    participant.unreadCount = 0;
    await conversation.save();
  }

  emitMessagesRead(id, { userId: req.user._id.toString(), readAt: readAt.toISOString() });

  return res.json({
    success: true,
    readAt: readAt.toISOString(),
  });
}

export async function searchConversations(req, res) {
  const { q } = req.query;

  if (!q?.trim()) {
    throw new AppError('Search query q is required', 400, 'Validation error');
  }

  const term = q.trim();
  const conversations = await Conversation.find({
    'participants.user': req.user._id,
    $or: [
      { lastMessage: { $regex: term, $options: 'i' } },
    ],
  })
    .populate('participants.user lastMessageSender')
    .sort({ lastMessageAt: -1 })
    .limit(20);

  const filtered = conversations.filter((c) => {
    const other = c.getOtherParticipant(req.user._id);
    const name = other?.name || '';
    return name.toLowerCase().includes(term.toLowerCase()) || c.lastMessage?.toLowerCase().includes(term.toLowerCase());
  });

  return res.json({
    success: true,
    conversations: filtered.map((c) =>
      c.toListJSON(req.user._id, {
        online: isUserOnline(c.getOtherParticipant(req.user._id)?._id || c.getOtherParticipant(req.user._id)),
      })
    ),
    total: filtered.length,
  });
}
