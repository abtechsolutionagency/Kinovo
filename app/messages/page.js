'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, MoreVertical, Phone, Video, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockMessages } from '@/lib/mockData';
import { BottomNav } from '@/components/BottomNav';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [translateEnabled, setTranslateEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const mockChatMessages = [
    {
      id: '1',
      senderId: 'user2',
      text: 'Hey! Are you still planning to come to Ibiza next week?',
      timestamp: '10:30 AM',
      translated: false
    },
    {
      id: '2',
      senderId: 'user1',
      text: 'Yes! Super excited. Have you found good places to check out?',
      timestamp: '10:32 AM',
      translated: false
    },
    {
      id: '3',
      senderId: 'user2',
      text: 'Absolutely! I found this amazing beach club. We should go together!',
      timestamp: '10:33 AM',
      translated: false
    },
    {
      id: '4',
      senderId: 'user1',
      text: "That sounds perfect! What's the vibe like?",
      timestamp: '10:35 AM',
      translated: false
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Mock send
      setMessage('');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex flex-col">
      {selectedChat ? (
        // Chat View
        <div className="flex flex-col h-screen">
          {/* Chat Header */}
          <div className="bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 px-4 py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedChat(null)}
                className="text-purple-400 hover:text-purple-300"
              >
                ←
              </button>
              <div className="relative">
                <img
                  src={mockMessages[0].userAvatar}
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                {mockMessages[0].online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-white font-semibold">{mockMessages[0].userName}</h2>
                <p className="text-purple-300 text-xs">Active now</p>
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
            
            {/* Translation Toggle */}
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

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-4">
              {mockChatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.senderId === 'user1' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      msg.senderId === 'user1'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'bg-white/10 text-white border border-purple-500/20'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    {translateEnabled && msg.senderId !== 'user1' && (
                      <p className="text-xs text-purple-200 mt-2 pt-2 border-t border-purple-400/30">
                        <Globe className="w-3 h-3 inline mr-1" />
                        Translated from Spanish
                      </p>
                    )}
                    <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="bg-slate-950/80 backdrop-blur-lg border-t border-purple-500/20 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        // Conversations List
        <>
          <div className="bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 px-4 py-4">
            <h1 className="text-2xl font-bold text-white mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 pb-20">
            <div className="p-4 space-y-2">
              {mockMessages.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedChat(chat)}
                  className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={chat.userAvatar}
                        alt={chat.userName}
                        className="w-14 h-14 rounded-full"
                      />
                      {chat.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-950 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-semibold truncate">
                          {chat.userName}
                        </h3>
                        <span className="text-purple-400 text-xs">{chat.timestamp}</span>
                      </div>
                      <p className="text-purple-300 text-sm truncate">
                        {chat.lastMessage}
                      </p>
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
  );
}
