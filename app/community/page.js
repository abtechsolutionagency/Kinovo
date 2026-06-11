'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Sparkles, Plus, Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { AppPage, PageContent, PageHeader, CardGrid } from '@/components/AppPage';
import { GroupCard } from '@/components/GroupCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cityGroups, discussionPrompts } from '@/lib/cityGroups';
import { useAuthStore } from '@/store/authStore';
import { groupApi, connectionApi } from '@/lib/apiClient';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CommunityPage() {
  const { token } = useAuthStore();
  const [aiPrompts, setAiPrompts] = useState(discussionPrompts);
  const [promptLoading, setPromptLoading] = useState(false);
  const [groups, setGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  const loadGroups = useCallback(async () => {
    if (!token) return;
    try {
      const data = await groupApi.list({ limit: 30 }, token);
      setGroups(data.groups || []);
    } catch {
      toast.error('Failed to load groups');
    } finally {
      setGroupsLoading(false);
    }
  }, [token]);

  const loadConnections = useCallback(async () => {
    if (!token) return;
    try {
      const data = await connectionApi.list('pending', token);
      const received = (data.connections || []).filter((c) => c.direction === 'received');
      setPendingCount(received.length);
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => {
    loadGroups();
    loadConnections();
  }, [loadGroups, loadConnections]);

  const generateNewPrompts = async () => {
    setPromptLoading(true);
    try {
      const response = await fetch('/api/ai/discussion-prompts');
      const data = await response.json();
      if (data.success && data.prompts) {
        setAiPrompts([...aiPrompts, ...data.prompts.slice(0, 3)]);
      }
    } catch {
      toast.error('Could not refresh prompts');
    } finally {
      setPromptLoading(false);
    }
  };

  const handleJoin = async (group) => {
    setJoiningId(group.id);
    try {
      await groupApi.join(group.id, token);
      toast.success('Joined group!');
      await loadGroups();
    } catch (err) {
      toast.error(err.message || 'Failed to join');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <AppPage>
      <PageHeader
        title="Community"
        subtitle="Connect with travelers worldwide"
        action={
          <div className="flex gap-2">
            <Link href="/connections">
              <Button size="sm" variant="outline" className="border-purple-500/30 text-purple-200 h-9 relative">
                <UserPlus className="w-4 h-4" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-pink-600 text-[9px] flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/groups/create">
              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 h-9">
                <Plus className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        }
      />

      <PageContent>
        <Tabs defaultValue="groups" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 border border-purple-500/20">
            <TabsTrigger value="discussions" className="data-[state=active]:bg-purple-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Travel Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            <div className="lg:col-span-1 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-lg border border-purple-500/30 rounded-xl p-4 h-fit lg:sticky lg:top-28">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-white font-semibold">AI-Suggested Topics</h3>
                </div>
                <Button
                  onClick={generateNewPrompts}
                  disabled={promptLoading}
                  size="sm"
                  variant="ghost"
                  className="text-purple-300"
                >
                  {promptLoading ? '...' : 'Refresh'}
                </Button>
              </div>
              <div className="space-y-2">
                {aiPrompts.slice(0, 3).map((prompt, index) => (
                  <motion.button
                    key={prompt.id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full text-left p-3 rounded-lg bg-white/5 border border-purple-500/20 hover:border-purple-500/50"
                  >
                    <div className="text-white font-medium mb-1">{prompt.title}</div>
                    <div className="text-purple-300 text-sm">{prompt.preview}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
            {aiPrompts.map((discussion, index) => (
              <motion.div
                key={discussion.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4"
              >
                <h3 className="text-white font-semibold mb-1">{discussion.title}</h3>
                <p className="text-purple-300 text-sm">{discussion.preview}</p>
              </motion.div>
            ))}
            </div>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="mt-6">
            {groupsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            ) : groups.length > 0 ? (
              <CardGrid>
              {groups.map((group, index) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  index={index}
                  onJoin={handleJoin}
                  joinLoading={joiningId === group.id}
                />
              ))}
              </CardGrid>
            ) : (
              <>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-4 lg:col-span-full">
                  <p className="text-purple-300 text-sm">
                    No API groups yet — browse pre-seeded city communities below or create your own.
                  </p>
                </div>
                <CardGrid>
                {cityGroups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden"
                  >
                    <div className="aspect-[16/9] relative">
                      <img src={group.image} alt={group.city} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-lg">{group.title}</h3>
                        <p className="text-purple-300 text-sm">{group.city}, {group.country}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-purple-200 text-sm mb-3">{group.description}</p>
                      <Link href="/groups/create">
                        <Button size="sm" className="bg-purple-600">Create Similar Group</Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
                </CardGrid>
              </>
            )}
          </TabsContent>
        </Tabs>
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
