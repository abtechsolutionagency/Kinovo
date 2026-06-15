'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, Plane, Filter } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BottomNav } from '@/components/BottomNav';
import { SearchBar } from '@/components/SearchBar';
import { AppPage, PageContent, PageHeader, EmptyState } from '@/components/AppPage';
import { TravelCard } from '@/components/TravelCard';
import { useAuthStore } from '@/store/authStore';
import { travelApi } from '@/lib/apiClient';
import { mockDestinations } from '@/lib/mockData';
import { toast } from 'sonner';

export default function TravelsPage() {
  const { token } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [travels, setTravels] = useState([]);
  const [travelTotal, setTravelTotal] = useState(0);
  const [destinationFilter, setDestinationFilter] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTravels = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (destinationFilter) params.destination = destinationFilter;
      if (upcomingOnly) params.upcoming = true;
      const data = await travelApi.list(params, token);
      setTravels(data.travels || []);
      setTravelTotal(data.total ?? data.travels?.length ?? 0);
    } catch {
      toast.error('Failed to load travels');
      setTravels([]);
    } finally {
      setLoading(false);
    }
  }, [token, destinationFilter, upcomingOnly]);

  useEffect(() => {
    loadTravels();
  }, [loadTravels]);

  const filteredTravels = useMemo(() => {
    if (!searchQuery) return travels;
    const q = searchQuery.toLowerCase();
    return travels.filter(
      (t) =>
        t.title?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.destinationName?.toLowerCase().includes(q) ||
        t.destinationId?.toLowerCase().includes(q) ||
        t.travelStyle?.toLowerCase().includes(q)
    );
  }, [travels, searchQuery]);

  return (
    <AppPage>
      <PageHeader title="Travels" subtitle="Browse trips and experiences" />

      <div className="px-4 lg:px-0 pb-2">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search trips by title, destination, or style…"
        />
      </div>

      <PageContent className="!pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 p-4 rounded-xl bg-white/5 border border-purple-500/20">
          <div className="flex items-center gap-2 text-purple-300 text-sm shrink-0">
            <Filter className="w-4 h-4" />
            Filters
          </div>
          <select
            value={destinationFilter}
            onChange={(e) => setDestinationFilter(e.target.value)}
            className="h-10 rounded-lg bg-white/10 border border-purple-500/30 text-white px-3 text-sm flex-1 sm:max-w-[220px]"
          >
            <option value="" className="bg-slate-900">All destinations</option>
            {mockDestinations.map((d) => (
              <option key={d.id} value={d.id} className="bg-slate-900">
                {d.name}, {d.country}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-purple-500/20">
            <Switch id="upcoming" checked={upcomingOnly} onCheckedChange={setUpcomingOnly} />
            <Label htmlFor="upcoming" className="text-purple-200 text-sm cursor-pointer">
              Upcoming only
            </Label>
          </div>
          {travelTotal > 0 && (
            <span className="text-purple-400 text-xs sm:ml-auto">{travelTotal} trips found</span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        ) : filteredTravels.length === 0 ? (
          <EmptyState
            icon={Plane}
            title="No travels found"
            description={
              upcomingOnly
                ? 'No upcoming trips match your filters. Try turning off "Upcoming only".'
                : 'Check back soon — admins add new trips regularly.'
            }
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
            {filteredTravels.map((travel, index) => (
              <TravelCard key={travel.id} travel={travel} index={index} />
            ))}
          </div>
        )}
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
