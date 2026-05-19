'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, TrendingUp, Clock, Users, Sparkles, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cityGroups, discussionPrompts } from '@/lib/cityGroups';

export default function CommunityPage() {
  const [aiPrompts, setAiPrompts] = useState(discussionPrompts);
  const [loading, setLoading] = useState(false);

  const generateNewPrompts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/discussion-prompts');
      const data = await response.json();
      if (data.success && data.prompts) {
        // Add to existing prompts
        setAiPrompts([...aiPrompts, ...data.prompts.slice(0, 3)]);
      }
    } catch (error) {
      console.error('Error generating prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950 to-slate-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-purple-500/20 px-4 py-4">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">Community</h1>
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>
        <p className="text-purple-300 text-sm">
          Connect with travelers worldwide
        </p>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-purple-500/20">
            <TabsTrigger value="discussions" className="data-[state=active]:bg-purple-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              City Groups
            </TabsTrigger>
          </TabsList>

          {/* Discussions */}
          <TabsContent value="discussions" className="mt-6 space-y-4">
            {/* AI Generated Prompts */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-lg border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold">AI-Suggested Topics</h3>
                </div>
                <Button
                  onClick={generateNewPrompts}
                  disabled={loading}
                  size="sm"
                  variant="ghost"
                  className="text-purple-300 hover:text-purple-200"
                >
                  Refresh
                </Button>
              </div>
              <p className="text-purple-300 text-sm mb-3">
                Start conversations with AI-powered discussion starters
              </p>
              <div className="space-y-2">
                {aiPrompts.slice(0, 3).map((prompt, index) => (
                  <motion.button
                    key={prompt.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full text-left p-3 rounded-lg bg-white/5 border border-purple-500/20 hover:border-purple-500/50 transition-all"
                  >
                    <div className="text-white font-medium mb-1">{prompt.title}</div>
                    <div className="text-purple-300 text-sm">{prompt.preview}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Regular Discussions */}
            <div className="flex items-center gap-2 text-purple-300 mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Trending Discussions</span>
            </div>

            {aiPrompts.map((discussion, index) => (
              <motion.div
                key={discussion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Discussion${index}`}
                    alt="Author"
                    className="w-10 h-10 rounded-full bg-purple-500/20"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">
                      {discussion.title}
                    </h3>
                    <p className="text-purple-300 text-sm mb-3">
                      {discussion.preview}
                    </p>
                    <div className="flex items-center gap-4 text-purple-400 text-sm">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{discussion.replies} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>2h ago</span>
                      </div>
                      {discussion.category && (
                        <span className="px-2 py-1 rounded-full bg-purple-500/20 text-xs">
                          {discussion.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>

          {/* City Groups */}
          <TabsContent value="groups" className="mt-6 space-y-4">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-white font-semibold">Pre-Seeded Communities</h3>
              </div>
              <p className="text-purple-300 text-sm">
                Join local communities in cities worldwide. These groups are ready for members!
              </p>
            </div>

            {cityGroups.map((group, index) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <div className="aspect-[16/9] relative">
                  <img
                    src={group.image}
                    alt={group.city}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 text-purple-300 text-sm mb-2">
                      <Users className="w-4 h-4" />
                      <span>{group.members} members</span>
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">
                      {group.title}
                    </h3>
                    <p className="text-purple-300 text-sm">
                      {group.city}, {group.country}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-purple-200 text-sm mb-3">
                    {group.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Join
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
