import mongoose from 'mongoose';
import { Connection } from '../models/Connection.js';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { findOrCreateConversation } from '../services/conversationService.js';

export async function sendConnectionRequest(req, res) {
  const { targetUserId } = req.body;

  if (!targetUserId) {
    throw new AppError('targetUserId is required', 400, 'Validation error');
  }

  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new AppError('Invalid target user id', 400, 'Validation error');
  }

  if (targetUserId === req.user._id.toString()) {
    throw new AppError('Cannot send a connection request to yourself', 400, 'Validation error');
  }

  const targetUser = await User.findById(targetUserId);
  if (!targetUser) {
    throw new AppError('User not found', 404, 'Not found');
  }

  const existing = await Connection.findOne({
    $or: [
      { requester: req.user._id, recipient: targetUserId },
      { requester: targetUserId, recipient: req.user._id },
    ],
  });

  if (existing) {
    if (existing.status === 'accepted') {
      throw new AppError('You are already connected with this user', 409, 'Conflict');
    }
    if (existing.status === 'pending') {
      throw new AppError('A connection request already exists', 409, 'Conflict');
    }
    if (existing.status === 'rejected') {
      throw new AppError('Connection request was previously rejected', 409, 'Conflict');
    }
  }

  const connection = await Connection.create({
    requester: req.user._id,
    recipient: targetUserId,
    status: 'pending',
  });

  await connection.populate(['requester', 'recipient']);

  return res.status(201).json({
    success: true,
    connection: connection.toJSON(req.user._id.toString()),
    message: 'Connection request sent',
  });
}

export async function listConnections(req, res) {
  const { status } = req.query;
  const allowedStatuses = ['pending', 'accepted', 'rejected'];

  const filter = {
    $or: [{ requester: req.user._id }, { recipient: req.user._id }],
  };

  if (status) {
    if (!allowedStatuses.includes(status)) {
      throw new AppError('Status must be pending, accepted, or rejected', 400, 'Validation error');
    }
    filter.status = status;
  }

  const connections = await Connection.find(filter)
    .populate('requester')
    .populate('recipient')
    .sort({ updatedAt: -1 });

  return res.json({
    success: true,
    connections: connections.map((c) => c.toJSON(req.user._id.toString())),
    total: connections.length,
  });
}

export async function updateConnection(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid connection id', 400, 'Validation error');
  }

  if (!['accepted', 'rejected'].includes(status)) {
    throw new AppError('Status must be accepted or rejected', 400, 'Validation error');
  }

  const connection = await Connection.findById(id);
  if (!connection) {
    throw new AppError('Connection not found', 404, 'Not found');
  }

  if (connection.status !== 'pending') {
    throw new AppError('Only pending requests can be updated', 409, 'Conflict');
  }

  if (connection.recipient.toString() !== req.user._id.toString()) {
    throw new AppError('Only the recipient can accept or reject this request', 403, 'Forbidden');
  }

  connection.status = status;
  await connection.save();
  await connection.populate(['requester', 'recipient']);

  let conversation = null;
  if (status === 'accepted') {
    conversation = await findOrCreateConversation(connection.requester._id, connection.recipient._id);
  }

  const action = status === 'accepted' ? 'accepted' : 'rejected';

  return res.json({
    success: true,
    connection: connection.toJSON(req.user._id.toString()),
    conversation: conversation
      ? { id: conversation._id.toString(), participantKey: conversation.participantKey }
      : null,
    message: `Connection request ${action}`,
  });
}
