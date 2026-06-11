'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Users, Loader2, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { AppPage, PageContent, HeroBanner, EmptyState } from '@/components/AppPage';
import { GroupCard } from '@/components/GroupCard';
import { TravelerCard } from '@/components/TravelerCard';
import { TravelCard } from '@/components/TravelCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { discoverApi, groupApi, travelApi, connectionApi } from '@/lib/apiClient';
import { getDestinationMeta } from '@/lib/destinations';
import { toast } from 'sonner';

export default function DestinationPage() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const meta = getDestinationMeta(id);
  const [travelers, setTravelers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [travels, setTravels] = useState([]);
  const [connectionMap, setConnectionMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);
  const [joiningId, setJoiningId] = useState(null);

  useEffect(() => {
    async function load() {
      if (!token || !id) return;
      try {
        const [travelerData, groupData, travelData, connData] = await Promise.all([
          discoverApi.browseTravelers({ destination: meta.name, limit: 20 }, token),
          groupApi.list({ destination: id }, token),
          travelApi.list({ destination: id, upcoming: true }, token),
          connectionApi.list(null, token),
        ]);
        setTravelers(travelerData.users || []);
        setGroups(groupData.groups || []);
        setTravels(travelData.travels || []);
        const map = {};
        for (const c of connData.connections || []) {
          const uid = c.user?.id;
          if (!uid) continue;
          if (c.status === 'accepted') map[uid] = 'accepted';
          else if (c.status === 'pending')
            map[uid] = c.direction === 'sent' ? 'pending_sent' : 'pending_received';
        }
        setConnectionMap(map);
      } catch {
        toast.error('Failed to load destination');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, id, meta.name]);

  const handleConnect = async (traveler) => {
    setConnectingId(traveler.id);
    try {
      await connectionApi.sendRequest(traveler.id, token);
      setConnectionMap((m) => ({ ...m, [traveler.id]: 'pending_sent' }));
      toast.success('Connection request sent!');
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setConnectingId(null);
    }
  };

  const handleJoin = async (group) => {
    setJoiningId(group.id);
    try {
      await groupApi.join(group.id, token);
      toast.success('Joined!');
      const data = await groupApi.list({ destination: id }, token);
      setGroups(data.groups || []);
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <AppPage>
      <HeroBanner src={meta.image} alt={meta.name}>
        <Link href="/discover" className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" className="bg-slate-950/50 text-white rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h1 className="text-2xl font-bold text-white">{meta.name}</h1>
          <p className="text-purple-200 flex items-center gap-1 text-sm mt-1">
            <MapPin className="w-4 h-4" />
            {meta.country}
          </p>
        </div>
      </HeroBanner>

      <PageContent>
        <p className="text-purple-200 text-sm mb-5 leading-relaxed">{meta.description}</p>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : (
          <Tabs defaultValue="travels" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-purple-500/20 h-10">
              <TabsTrigger value="travels" className="data-[state=active]:bg-purple-600 text-xs">Trips</TabsTrigger>
              <TabsTrigger value="travelers" className="data-[state=active]:bg-purple-600 text-xs">Travelers</TabsTrigger>
              <TabsTrigger value="groups" className="data-[state=active]:bg-purple-600 text-xs">Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="travels" className="mt-5 grid grid-cols-2 gap-3">
              {travels.length === 0 ? (
                <div className="col-span-2">
                  <EmptyState
                    icon={Plane}
                    title="No trips yet"
                    description="Check back soon for upcoming adventures in this destination."
                  />
                </div>
              ) : (
                travels.map((t, i) => <TravelCard key={t.id} travel={t} index={i} />)
              )}
            </TabsContent>

            <TabsContent value="travelers" className="mt-5 space-y-3">
              {travelers.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No travelers yet"
                  description="Be the first to connect with others heading here."
                />
              ) : (
                travelers.map((t, i) => (
                  <TravelerCard
                    key={t.id}
                    traveler={t}
                    index={i}
                    connectionStatus={connectionMap[t.id] || 'none'}
                    onConnect={handleConnect}
                    connectLoading={connectingId === t.id}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="groups" className="mt-5 space-y-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-purple-300 text-sm flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {groups.length} groups
                </span>
                <Link href="/groups/create">
                  <Button size="sm" className="bg-purple-600 h-8">Create</Button>
                </Link>
              </div>
              {groups.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No groups yet"
                  description="Start a group and invite travelers to join your trip."
                  action={
                    <Link href="/groups/create">
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600">Create Group</Button>
                    </Link>
                  }
                />
              ) : (
                groups.map((g, i) => (
                  <GroupCard
                    key={g.id}
                    group={g}
                    index={i}
                    onJoin={handleJoin}
                    joinLoading={joiningId === g.id}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
