'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Users, Sparkles } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { SearchBar } from '@/components/SearchBar';
import { AppPage, PageContent, PageHeader, EmptyState } from '@/components/AppPage';
import { TravelerCard } from '@/components/TravelerCard';
import { useAuthStore } from '@/store/authStore';
import { discoverApi, connectionApi } from '@/lib/apiClient';
import { useConnectionMap } from '@/hooks/useConnectionMap';
import { toast } from 'sonner';

export default function TravelersPage() {
  const { token } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [travelers, setTravelers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectingId, setConnectingId] = useState(null);
  const { connectionMap, refreshConnections } = useConnectionMap(token);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadTravelers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await discoverApi.browseTravelers(
        { search: debouncedSearch || undefined, limit: 30 },
        token
      );
      setTravelers(data.users || []);
    } catch {
      toast.error('Failed to load travelers');
      setTravelers([]);
    } finally {
      setLoading(false);
    }
  }, [token, debouncedSearch]);

  useEffect(() => {
    loadTravelers();
  }, [loadTravelers]);

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

  return (
    <AppPage>
      <PageHeader title="Travelers" subtitle="Find and connect with fellow travelers" />

      <div className="px-4 lg:px-0 pb-2">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search travelers by name or interests…"
        />
      </div>

      <PageContent className="!pt-2">
        <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span className="text-sm">AI matching travelers based on your profile</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : travelers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No travelers found"
            description="Try a different search or check back later."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
        )}
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
