'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Loader2, MapPin, Users, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/BottomNav';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ConciergePagee() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI travel concierge. I can help you discover the best nightlife, find compatible travelers, plan meetups, and explore destinations. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const mockResponses = [
    "Based on your profile, I'd recommend checking out Pacha Ibiza tonight. It's known for its open-minded crowd and amazing music. There are 12 Kinovo members planning to be there!",
    "I found 3 travelers with similar interests heading to Tenerife next week. Would you like me to introduce you?",
    "For a more intimate vibe in London, try The Box Soho. It's exclusive and attracts a sophisticated crowd. I can help you get on the guest list.",
    "Here are the top-rated beach clubs in Benidorm right now. KU Beach Bar has the best sunset views and a welcoming atmosphere.",
  ];

  const quickQuestions = [
    { icon: MapPin, text: "Best nightlife spots nearby" },
    { icon: Users, text: "Find compatible travelers" },
    { icon: Calendar, text: "Plan weekend meetup" },
    { icon: TrendingUp, text: "Trending destinations" },
  ];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Mock AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">AI Concierge</h1>
            <p className="text-purple-300 text-sm">Your personal travel assistant</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs">
            Unlimited ✨
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-3xl mx-auto space-y-4 pb-32">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mr-2 flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-white/10 backdrop-blur-lg text-white border border-purple-500/20'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-purple-500/20 rounded-2xl px-4 py-3">
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-purple-300 text-sm mb-3">Quick questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((q, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleQuickQuestion(q.text)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-purple-500/20 hover:border-purple-500/50 text-purple-300 text-sm transition-all"
                >
                  <q.icon className="w-4 h-4" />
                  <span>{q.text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-slate-950/80 backdrop-blur-lg border-t border-purple-500/20 p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              placeholder="Ask me anything about travel, nightlife, or people..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="bg-white/10 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
