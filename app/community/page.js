'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { SearchBar } from '@/components/SearchBar';
import { AppPage, PageContent, PageHeader, CardGrid } from '@/components/AppPage';
import { GroupCard } from '@/components/GroupCard';
import { cityGroups } from '@/lib/cityGroups';
import { useAuthStore } from '@/store/authStore';
import { groupApi, connectionApi } from '@/lib/apiClient';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CommunityPage() {
  const { token } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    const q = searchQuery.toLowerCase();
    return groups.filter(
      (g) =>
        g.title?.toLowerCase().includes(q) ||
        g.destinationId?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
    );
  }, [groups, searchQuery]);

  const filteredCityGroups = useMemo(() => {
    if (!searchQuery) return cityGroups;
    const q = searchQuery.toLowerCase();
    return cityGroups.filter(
      (g) =>
        g.title?.toLowerCase().includes(q) ||
        g.city?.toLowerCase().includes(q) ||
        g.country?.toLowerCase().includes(q) ||
        g.description?.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <AppPage>
      <PageHeader
        title="Community"
        subtitle="Join travel groups and meet travelers"
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

      <div className="px-4 lg:px-0 pb-2">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search groups or destinations…"
        />
      </div>

      <PageContent className="!pt-2">
        {groupsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : filteredGroups.length > 0 ? (
          <CardGrid>
            {filteredGroups.map((group, index) => (
              <GroupCard
                key={group.id}
                group={group}
                index={index}
                onJoin={handleJoin}
                joinLoading={joiningId === group.id}
              />
            ))}
          </CardGrid>
        ) : filteredCityGroups.length > 0 ? (
          <>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-4 lg:col-span-full">
              <p className="text-purple-300 text-sm">
                No API groups yet — browse pre-seeded city communities below or create your own.
              </p>
            </div>
            <CardGrid>
              {filteredCityGroups.map((group, index) => (
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
        ) : (
          <p className="text-purple-300 text-center py-12 lg:col-span-full">
            {searchQuery ? 'No groups match your search.' : 'No travel groups yet.'}
          </p>
        )}
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
