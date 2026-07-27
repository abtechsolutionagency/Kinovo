'use client';

import { useState, useEffect, useCallback } from 'react';
import { Loader2, Users, Sparkles, Filter, Lock, Shield } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BottomNav } from '@/components/BottomNav';
import { SearchBar } from '@/components/SearchBar';
import { AppPage, PageContent, PageHeader, EmptyState } from '@/components/AppPage';
import { TravelerCard } from '@/components/TravelerCard';
import { UpgradePrompt } from '@/components/UpgradePrompt';
import { useAuthStore } from '@/store/authStore';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import { discoverApi, connectionApi } from '@/lib/apiClient';
import { TRAVEL_INTERESTS } from '@/lib/profileOptions';
import { useConnectionMap } from '@/hooks/useConnectionMap';
import { toast } from 'sonner';

export default function TravelersPage() {
  const { token } = useAuthStore();
  const { hasFeature } = usePlanFeatures();
  const canUseAdvancedFilters = hasFeature('advancedFilters');

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
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
      const params = { search: debouncedSearch || undefined, limit: 30 };
      if (canUseAdvancedFilters && interestFilter) params.interests = interestFilter;
      if (canUseAdvancedFilters && verifiedOnly) params.verified = true;
      const data = await discoverApi.browseTravelers(params, token);
      setTravelers(data.users || []);
    } catch {
      toast.error('Failed to load travelers');
      setTravelers([]);
    } finally {
      setLoading(false);
    }
  }, [token, debouncedSearch, interestFilter, verifiedOnly, canUseAdvancedFilters]);

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

  const handleInterestChange = (value) => {
    if (!canUseAdvancedFilters) {
      toast.error('Upgrade to Lite to use advanced filters');
      return;
    }
    setInterestFilter(value);
  };

  const handleVerifiedChange = (checked) => {
    if (!canUseAdvancedFilters) {
      toast.error('Upgrade to Lite to use advanced filters');
      return;
    }
    setVerifiedOnly(checked);
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

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 p-4 rounded-xl bg-white/5 border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-300 text-sm shrink-0">
            <Filter className="w-4 h-4" />
            Advanced filters
            {!canUseAdvancedFilters && <Lock className="w-3.5 h-3.5 text-purple-500" />}
          </div>
          <select
            value={interestFilter}
            onChange={(e) => handleInterestChange(e.target.value)}
            disabled={!canUseAdvancedFilters}
            className="h-10 rounded-lg bg-white/10 border border-purple-500/30 text-white px-3 text-sm flex-1 sm:max-w-[220px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="" className="bg-slate-900">All interests</option>
            {TRAVEL_INTERESTS.map((interest) => (
              <option key={interest} value={interest} className="bg-slate-900">
                {interest}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-purple-500/20">
            <Switch
              id="verified"
              checked={verifiedOnly}
              onCheckedChange={handleVerifiedChange}
              disabled={!canUseAdvancedFilters}
            />
            <Label
              htmlFor="verified"
              className={`text-sm cursor-pointer flex items-center gap-1 ${canUseAdvancedFilters ? 'text-purple-200' : 'text-purple-400'}`}
            >
              <Shield className="w-3.5 h-3.5" />
              Verified only
            </Label>
          </div>
        </div>

        {!canUseAdvancedFilters && (
          <div className="mb-5">
            <UpgradePrompt feature="advancedFilters" />
          </div>
        )}

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
