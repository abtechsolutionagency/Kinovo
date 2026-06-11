'use client';

import { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Send, MoreVertical, Phone, Video, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/BottomNav';
import { AppPage, PageHeader } from '@/components/AppPage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/store/authStore';
import { conversationApi } from '@/lib/apiClient';
import { resolveAvatarUrl } from '@/lib/avatarUrl';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  joinConversation,
  leaveConversation,
} from '@/lib/socket';

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatListTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return formatTime(isoString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <p className="text-purple-300">Loading messages...</p>
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}

function MessagesContent() {
  const { user, token } = useAuthStore();
  const searchParams = useSearchParams();
  const openConversationId = searchParams.get('conversation');
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [translateEnabled, setTranslateEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const urlOpenedRef = useRef(false);

  const loadConversations = useCallback(async () => {
    if (!token) return;
    try {
      const data = searchQuery.trim()
        ? await conversationApi.search(searchQuery.trim(), token)
        : await conversationApi.list(token);
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [token, searchQuery]);

  const loadMessages = useCallback(
    async (conversationId) => {
      if (!token || !conversationId) return;
      try {
        const data = await conversationApi.getMessages(conversationId, { limit: 50 }, token);
        setMessages(data.messages || []);
        await conversationApi.markRead(conversationId, token);
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c))
        );
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    },
    [token]
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!openConversationId || !token || urlOpenedRef.current) return;
    urlOpenedRef.current = true;
    async function openFromUrl() {
      try {
        const data = await conversationApi.get(openConversationId, token);
        const c = data.conversation;
        const chat = {
          id: c.id,
          userId: c.participant?.id,
          userName: c.participant?.name || 'User',
          userAvatar: c.participant?.avatar || '',
          online: c.online,
          lastMessage: c.lastMessage,
          timestamp: c.lastMessageAt,
          unread: c.unread || 0,
        };
        setSelectedChat(chat);
        await loadMessages(chat.id);
        joinConversation(chat.id);
      } catch {
        /* list will show if invalid id */
      }
    }
    openFromUrl();
  }, [openConversationId, token, loadMessages]);

  useEffect(() => {
    if (!token) return;

    connectSocket();
    const socket = getSocket();
    if (!socket) return;

    const onNewMessage = (msg) => {
      if (selectedChat?.id === msg.conversationId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        conversationApi.markRead(msg.conversationId, token);
      }

      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== msg.conversationId) return c;
          const isActive = selectedChat?.id === msg.conversationId;
          return {
            ...c,
            lastMessage: msg.text,
            timestamp: msg.timestamp,
            unread: isActive || msg.senderId === user?.id ? 0 : (c.unread || 0) + 1,
          };
        });
        return updated.sort(
          (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
        );
      });
    };

    const onPresence = ({ userId, online }) => {
      setConversations((prev) =>
        prev.map((c) => (c.userId === userId ? { ...c, online } : c))
      );
      setSelectedChat((prev) =>
        prev && prev.userId === userId ? { ...prev, online } : prev
      );
    };

    const onConnect = () => {
      if (selectedChat?.id) joinConversation(selectedChat.id);
    };

    socket.on('connect', onConnect);
    socket.on('message:new', onNewMessage);
    socket.on('presence:update', onPresence);
    if (socket.connected) onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('message:new', onNewMessage);
      socket.off('presence:update', onPresence);
    };
  }, [token, selectedChat?.id, user?.id]);

  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openChat = async (chat) => {
    setSelectedChat(chat);
    await loadMessages(chat.id);
    joinConversation(chat.id);
  };

  const closeChat = () => {
    if (selectedChat?.id) {
      leaveConversation(selectedChat.id);
    }
    setSelectedChat(null);
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !token || sending) return;

    setSending(true);
    const text = message.trim();
    setMessage('');

    try {
      const data = await conversationApi.sendMessage(selectedChat.id, text, token);
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
      setConversations((prev) =>
        prev
          .map((c) =>
            c.id === selectedChat.id
              ? { ...c, lastMessage: text, timestamp: data.message.timestamp, unread: 0 }
              : c
          )
          .sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0))
      );
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessage(text);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations;

  return (
    <AppPage className="h-screen">
      <div className="flex flex-col h-screen min-h-0">
      {selectedChat ? (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="bg-slate-950/90 backdrop-blur-xl border-b border-purple-500/20 px-4 py-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={closeChat}
                className="text-purple-400 hover:text-purple-300"
              >
                ←
              </button>
              <div className="relative">
                <img
                  src={resolveAvatarUrl(selectedChat.userAvatar)}
                  alt={selectedChat.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {selectedChat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold">{selectedChat.userName}</h2>
                <p className="text-purple-300 text-xs">
                  {selectedChat.online ? 'Active now' : 'Offline'}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-purple-400">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-purple-400">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-purple-400">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Globe className="w-4 h-4 text-purple-400" />
              <Label htmlFor="translate" className="text-purple-300 text-sm flex-1 cursor-pointer">
                Auto-translate messages
              </Label>
              <Switch
                id="translate"
                checked={translateEnabled}
                onCheckedChange={setTranslateEnabled}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {messages.map((msg) => {
                const isMine = msg.senderId === user?.id;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        isMine
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-white/10 text-white border border-purple-500/20'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      {translateEnabled && !isMine && msg.translated && (
                        <p className="text-xs text-purple-200 mt-2 pt-2 border-t border-purple-400/30">
                          <Globe className="w-3 h-3 inline mr-1" />
                          {msg.translated}
                        </p>
                      )}
                      <span className="text-xs opacity-70 mt-1 block">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="bg-slate-950/80 backdrop-blur-lg border-t border-purple-500/20 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
              />
              <Button
                type="submit"
                size="icon"
                disabled={sending || !message.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <PageHeader title="Messages" subtitle="Chat with your connections" />
          <div className="px-4 pb-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-400/60 rounded-xl"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0 pb-nav">
            <div className="p-4 space-y-2">
              {loading && (
                <p className="text-purple-300 text-center py-8">Loading conversations...</p>
              )}
              {!loading && filteredConversations.length === 0 && (
                <p className="text-purple-300 text-center py-8">
                  No conversations yet. Connect with a traveler to start messaging.
                </p>
              )}
              {filteredConversations.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openChat(chat)}
                  className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={resolveAvatarUrl(chat.userAvatar)}
                        alt={chat.userName}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-semibold truncate">{chat.userName}</h3>
                        <span className="text-purple-400 text-xs">
                          {formatListTime(chat.timestamp)}
                        </span>
                      </div>
                      <p className="text-purple-300 text-sm truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <BottomNav />
        </>
      )}
      </div>
    </AppPage>
  );
}
