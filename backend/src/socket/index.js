import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';
import { getConversationForUser } from '../services/conversationService.js';

let io = null;
const onlineUsers = new Map();

function setUserOnline(userId, socketId) {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socketId);
}

function setUserOffline(userId, socketId) {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return;
  sockets.delete(socketId);
  if (sockets.size === 0) {
    onlineUsers.delete(userId);
  }
}

export function isUserOnline(userId) {
  return onlineUsers.has(userId.toString());
}

export function getIO() {
  return io;
}

export function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error(error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    setUserOnline(userId, socket.id);

    socket.join(`user:${userId}`);
    io.emit('presence:update', { userId, online: true });

    socket.on('conversation:join', async ({ conversationId }) => {
      try {
        await getConversationForUser(conversationId, userId);
        socket.join(`conversation:${conversationId}`);
        socket.emit('conversation:joined', { conversationId });
      } catch (error) {
        socket.emit('error', { message: error.message || 'Cannot join conversation' });
      }
    });

    socket.on('conversation:leave', ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
    });

    socket.on('disconnect', () => {
      setUserOffline(userId, socket.id);
      if (!isUserOnline(userId)) {
        io.emit('presence:update', { userId, online: false });
      }
    });
  });

  return io;
}

export function emitNewMessage(conversationId, message, participantIds = []) {
  if (!io) return;
  const payload = { ...message, conversationId };
  io.to(`conversation:${conversationId}`).emit('message:new', payload);
  participantIds.forEach((userId) => {
    io.to(`user:${userId}`).emit('message:new', payload);
  });
}

export function emitMessagesRead(conversationId, { userId, readAt }) {
  if (!io) return;
  io.to(`conversation:${conversationId}`).emit('message:read', {
    conversationId,
    userId,
    readAt,
  });
}
