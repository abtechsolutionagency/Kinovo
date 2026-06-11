'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Users, TrendingUp, Filter, Sparkles, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BottomNav } from '@/components/BottomNav';
import { AppPage, PageContent, PageHeader } from '@/components/AppPage';
import { TravelerCard } from '@/components/TravelerCard';
import { GroupCard } from '@/components/GroupCard';
import { TravelCard } from '@/components/TravelCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { discoverApi, connectionApi, groupApi, travelApi } from '@/lib/apiClient';
import { mockDestinations } from '@/lib/mockData';
import { travelsToDestinations, getDestinationMeta } from '@/lib/destinations';
import Link from 'next/link';
import { toast } from 'sonner';

function useConnectionMap(token) {
  const [map, setMap] = useState({});

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const data = await connectionApi.list(null, token);
      const next = {};
      for (const c of data.connections || []) {
        const uid = c.user?.id;
        if (!uid) continue;
        if (c.status === 'accepted') next[uid] = 'accepted';
        else if (c.status === 'pending') next[uid] = c.direction === 'sent' ? 'pending_sent' : 'pending_received';
      }
      setMap(next);
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { connectionMap: map, refreshConnections: refresh };
}

export default function DiscoverPage() {
  const { token } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('destinations');
  const [destinations, setDestinations] = useState([]);
  const [travelers, setTravelers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);
  const [joiningId, setJoiningId] = useState(null);
  const { connectionMap, refreshConnections } = useConnectionMap(token);

  const loadDestinations = useCallback(async () => {
    if (!token) return;
    try {
      const data = await travelApi.list({ upcoming: true, limit: 50 }, token);
      const fromApi = travelsToDestinations(data.travels);
      setDestinations(fromApi.length > 0 ? fromApi : mockDestinations);
    } catch {
      setDestinations(mockDestinations);
    }
  }, [token]);

  const loadTravelers = useCallback(async () => {
    if (!token) return;
    try {
      const data = await discoverApi.browseTravelers(
        { search: searchQuery || undefined, limit: 30 },
        token
      );
      setTravelers(data.users || []);
    } catch {
      toast.error('Failed to load travelers');
    }
  }, [token, searchQuery]);

  const loadGroups = useCallback(async () => {
    if (!token) return;
    try {
      const data = await groupApi.list({ limit: 30 }, token);
      let list = data.groups || [];
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter(
          (g) =>
            g.title?.toLowerCase().includes(q) ||
            g.destinationId?.toLowerCase().includes(q) ||
            g.description?.toLowerCase().includes(q)
        );
      }
      setGroups(list);
    } catch {
      toast.error('Failed to load groups');
    }
  }, [token, searchQuery]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await loadDestinations();
      setLoading(false);
    }
    load();
  }, [loadDestinations]);

  useEffect(() => {
    if (activeTab === 'travelers') loadTravelers();
    if (activeTab === 'groups') loadGroups();
  }, [activeTab, loadTravelers, loadGroups]);

  const filteredDestinations = useMemo(() => {
    if (!searchQuery) return destinations;
    const q = searchQuery.toLowerCase();
    return destinations.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.country?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
    );
  }, [destinations, searchQuery]);

  const handleConnect = async (traveler) => {
    if (!token) return;
    setConnectingId(traveler.id);
    try {
      await connectionApi.sendRequest(traveler.id, token);
      toast.success(`Connection request sent to ${traveler.name}`);
      await refreshConnections();
    } catch (err) {
      toast.error(err.message || 'Failed to send request');
    } finally {
      setConnectingId(null);
    }
  };

  const handleJoinGroup = async (group) => {
    if (!token) return;
    setJoiningId(group.id);
    try {
      await groupApi.join(group.id, token);
      toast.success('Joined group!');
      await loadGroups();
    } catch (err) {
      toast.error(err.message || 'Failed to join group');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <AppPage>
      <PageHeader
        title="Discover"
        subtitle="Find destinations, travelers & groups"
        action={
          <Link href="/groups/create">
            <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 h-9">
              <Plus className="w-4 h-4" />
            </Button>
          </Link>
        }
      />

      <div className="px-4 lg:px-0 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
          <Input
            placeholder="Search destinations, people, groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-white/10 border-purple-500/30 text-white placeholder:text-purple-400/60 focus:border-purple-400 rounded-xl"
          />
        </div>
      </div>

      <PageContent className="!pt-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-purple-500/20 p-1 h-auto rounded-xl">
            <TabsTrigger value="destinations" className="data-[state=active]:bg-purple-600 rounded-lg text-xs sm:text-sm py-2">
              <MapPin className="w-4 h-4 mr-2" />
              Destinations
            </TabsTrigger>
            <TabsTrigger value="travelers" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Travelers
            </TabsTrigger>
            <TabsTrigger value="groups" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Groups
            </TabsTrigger>
          </TabsList>

          <TabsContent value="destinations" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
                {filteredDestinations.map((destination, index) => (
                  <Link key={destination.id} href={`/destinations/${destination.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
                    >
                      <div className="aspect-[4/5] relative">
                        <img
                          src={destination.image}
                          alt={destination.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-bold text-white mb-1">{destination.name}</h3>
                          <p className="text-purple-300 text-xs mb-2">{destination.country}</p>
                          <div className="flex items-center gap-1 text-purple-400 text-sm">
                            <Users className="w-3 h-3" />
                            <span>{destination.travelCount || destination.travelers || 0}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="travelers" className="mt-6">
            <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="text-sm">AI matching travelers based on your profile</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {travelers.length === 0 && !loading && (
                <p className="text-purple-300 text-center py-8 lg:col-span-2">No travelers found. Try a different search.</p>
              )}
              {travelers.map((traveler, i) => (
                <TravelerCard
                  key={traveler.id}
                  traveler={traveler}
                  index={i}
                  connectionStatus={connectionMap[traveler.id] || 'none'}
                  onConnect={handleConnect}
                  connectLoading={connectingId === traveler.id}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {groups.length === 0 && (
                <div className="text-center py-8 md:col-span-2 xl:col-span-3">
                  <p className="text-purple-300 mb-4">No travel groups yet.</p>
                  <Link href="/groups/create">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600">Create a Group</Button>
                  </Link>
                </div>
              )}
              {groups.map((group, index) => (
                <GroupCard
                  key={group.id}
                  group={group}
                  index={index}
                  onJoin={handleJoinGroup}
                  joinLoading={joiningId === group.id}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
