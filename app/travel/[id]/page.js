'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BottomNav } from '@/components/BottomNav';
import { AppPage, PageContent, HeroBanner } from '@/components/AppPage';
import { useAuthStore } from '@/store/authStore';
import { travelApi } from '@/lib/apiClient';
import { getDestinationMeta } from '@/lib/destinations';
import { resolveAvatarUrl } from '@/lib/avatarUrl';
import { toast } from 'sonner';

export default function TravelDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!token || !id) return;
      try {
        const data = await travelApi.get(id, token);
        setTravel(data.travel);
      } catch {
        toast.error('Travel not found');
        router.push('/discover');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!travel) return null;

  const meta = getDestinationMeta(travel.destinationId);
  const image = travel.image || meta.image;
  const creator = typeof travel.createdBy === 'object' ? travel.createdBy : null;

  return (
    <AppPage>
      <HeroBanner src={image} alt={travel.title}>
        <Link href="/discover" className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" className="bg-black/40 backdrop-blur text-white border border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Badge className="absolute top-4 right-4 capitalize bg-purple-600/90">{travel.status}</Badge>
      </HeroBanner>

      <PageContent>
        <h1 className="text-2xl font-bold text-white mb-1">{travel.title}</h1>
        <p className="text-purple-300 mb-4">{travel.destinationName || meta.name}</p>

        <div className="flex flex-wrap gap-4 text-purple-300 text-sm mb-6">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {meta.name}{meta.country ? `, ${meta.country}` : ''}
          </span>
          {travel.startDate && (
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(travel.startDate).toLocaleDateString()}
              {travel.endDate && ` – ${new Date(travel.endDate).toLocaleDateString()}`}
            </span>
          )}
        </div>

        <p className="text-purple-200 mb-6">{travel.description || 'No details provided.'}</p>

        {travel.travelStyle && (
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-6">
            {travel.travelStyle}
          </Badge>
        )}

        {creator && (
          <Link
            href={`/traveler/${creator.id}`}
            className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-purple-500/20 hover:border-purple-500/50"
          >
            <img
              src={resolveAvatarUrl(creator.avatar)}
              alt={creator.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-purple-400 text-xs">Organized by</p>
              <p className="text-white font-medium">{creator.name}</p>
            </div>
          </Link>
        )}

        <Link href={`/destinations/${travel.destinationId}`} className="block mt-4">
          <Button variant="outline" className="w-full border-purple-500/30 text-purple-200">
            Explore {meta.name} Groups & Travelers
          </Button>
        </Link>
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
