'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Heart,
  Languages,
  Shield,
  MessageCircle,
  UserPlus,
  Loader2,
  Sparkles,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BottomNav } from '@/components/BottomNav';
import { AppPage, PageContent, HeroBanner, GlassCard } from '@/components/AppPage';
import { useAuthStore } from '@/store/authStore';
import { discoverApi, connectionApi, conversationApi } from '@/lib/apiClient';
import { resolveAvatarUrl } from '@/lib/avatarUrl';
import { getMatchLevel } from '@/lib/matchScoring';
import { toast } from 'sonner';

export default function TravelerProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [traveler, setTraveler] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('none');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!token || !id) return;
      try {
        const [profileData, connData] = await Promise.all([
          discoverApi.getTraveler(id, token),
          connectionApi.list(null, token),
        ]);
        setTraveler(profileData.user);
        const conn = (connData.connections || []).find((c) => c.user?.id === id);
        if (conn?.status === 'accepted') setConnectionStatus('accepted');
        else if (conn?.status === 'pending')
          setConnectionStatus(conn.direction === 'sent' ? 'pending_sent' : 'pending_received');
      } catch {
        toast.error('Traveler not found');
        router.push('/discover');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, id, router]);

  const handleConnect = async () => {
    setActionLoading(true);
    try {
      await connectionApi.sendRequest(id, token);
      setConnectionStatus('pending_sent');
      toast.success('Connection request sent!');
    } catch (err) {
      toast.error(err.message || 'Failed to connect');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessage = async () => {
    setActionLoading(true);
    try {
      const data = await conversationApi.create(id, token);
      router.push(`/messages?conversation=${data.conversation.id}`);
    } catch (err) {
      toast.error(err.message || 'Start a connection first to message');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AppPage>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      </AppPage>
    );
  }

  if (!traveler) return null;

  const match = getMatchLevel(traveler.matchScore || 0);
  const prefs = traveler.travelPreferences || {};
  const isSelf = user?.id === traveler.id;

  return (
    <AppPage>
      <HeroBanner src={resolveAvatarUrl(traveler.avatar)} alt={traveler.name} compact>
        <Link href="/discover" className="absolute top-4 left-4">
          <Button variant="ghost" size="icon" className="bg-black/40 backdrop-blur text-white border border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </HeroBanner>

      <PageContent className="-mt-10 relative z-10">
        <div className="flex items-end gap-4 mb-6">
          <img
            src={resolveAvatarUrl(traveler.avatar)}
            alt={traveler.name}
            className="w-28 h-28 rounded-2xl border-4 border-slate-950 object-cover bg-white/10"
          />
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-white">{traveler.name}</h1>
              {traveler.verified && <Shield className="w-5 h-5 text-blue-400" />}
              {traveler.isPremium && <Crown className="w-5 h-5 text-yellow-400" />}
            </div>
            {traveler.location && (
              <p className="text-purple-300 text-sm flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {traveler.location}
              </p>
            )}
          </div>
        </div>

        {traveler.matchScore != null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">Match Score</span>
              </div>
              <span className={`text-xl font-bold ${match.color}`}>{traveler.matchScore}%</span>
            </div>
            <Progress value={traveler.matchScore} className="h-2 mb-2" />
            <p className={`text-sm ${match.color}`}>{match.level}</p>
            {traveler.matchReasons?.length > 0 && (
              <ul className="mt-2 space-y-1">
                {traveler.matchReasons.map((r) => (
                  <li key={r} className="text-purple-300 text-xs">• {r}</li>
                ))}
              </ul>
            )}
          </motion.div>
        )}

        {traveler.bio && <p className="text-purple-200 mb-6">{traveler.bio}</p>}

        {traveler.interests?.length > 0 && (
          <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
              <Heart className="w-5 h-5" />
              Interests
            </div>
            <div className="flex flex-wrap gap-2">
              {traveler.interests.map((i) => (
                <Badge key={i} className="bg-pink-500/20 text-pink-300 border-pink-500/30">{i}</Badge>
              ))}
            </div>
          </div>
        )}

        {traveler.languages?.length > 0 && (
          <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
              <Languages className="w-5 h-5" />
              Languages
            </div>
            <div className="flex flex-wrap gap-2">
              {traveler.languages.map((l) => (
                <Badge key={l} className="bg-purple-500/20 text-purple-300 border-purple-500/30">{l}</Badge>
              ))}
            </div>
          </div>
        )}

        {(prefs.budget || prefs.travelStyle) && (
          <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4 mb-6 text-sm text-purple-300 space-y-1">
            {prefs.budget && <p><span className="text-purple-400">Budget:</span> {prefs.budget}</p>}
            {prefs.travelStyle && <p><span className="text-purple-400">Style:</span> {prefs.travelStyle}</p>}
            {prefs.accommodation && <p><span className="text-purple-400">Stay:</span> {prefs.accommodation}</p>}
          </div>
        )}

        {!isSelf && (
          <div className="flex gap-3">
            {connectionStatus === 'accepted' ? (
              <Button
                onClick={handleMessage}
                disabled={actionLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            ) : connectionStatus === 'pending_sent' ? (
              <Button disabled className="flex-1 bg-purple-600/50">Request Pending</Button>
            ) : connectionStatus === 'pending_received' ? (
              <Link href="/connections" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">Respond to Request</Button>
              </Link>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={actionLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Connect
              </Button>
            )}
          </div>
        )}
      </PageContent>

      <BottomNav />
    </AppPage>
  );
}
