import { io } from 'socket.io-client';
import { getAuthToken } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let socket = null;

export function getSocket() {
  const token = getAuthToken();
  if (!token) return null;

  if (!socket) {
    socket = io(API_URL.replace(/\/$/, ''), {
      auth: { token },
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }

  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (s && !s.connected) {
    s.auth = { token: getAuthToken() };
    s.connect();
  }
  return s;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinConversation(conversationId) {
  const s = getSocket();
  if (s?.connected && conversationId) {
    s.emit('conversation:join', { conversationId });
  }
}

export function leaveConversation(conversationId) {
  const s = getSocket();
  if (s?.connected && conversationId) {
    s.emit('conversation:leave', { conversationId });
  }
}
