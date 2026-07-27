'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { resolveAvatarUrl } from '@/lib/avatarUrl';
import { getMatchLevel } from '@/lib/matchScoring';

export function TravelerCard({
  traveler,
  index = 0,
  connectionStatus = 'none',
  onConnect,
  connectLoading = false,
}) {
  const match = getMatchLevel(traveler.matchScore || 0);

  const connectLabel =
    connectionStatus === 'accepted'
      ? 'Connected'
      : connectionStatus === 'pending_sent'
        ? 'Pending'
        : connectionStatus === 'pending_received'
          ? 'Respond'
          : 'Connect';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`backdrop-blur-lg rounded-xl p-4 transition-all ${
        traveler.isBoosted
          ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/40 shadow-lg shadow-yellow-500/10'
          : 'bg-white/5 border border-purple-500/20 hover:border-purple-500/50'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        <Link href={`/traveler/${traveler.id}`}>
          <div className="relative">
            <img
              src={resolveAvatarUrl(traveler.avatar)}
              alt={traveler.name}
              className={`w-16 h-16 rounded-full object-cover bg-purple-500/20 ${
                traveler.isBoosted ? 'border-2 border-yellow-400/70' : 'border border-purple-500/30'
              }`}
            />
            {traveler.isBoosted && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center border-2 border-slate-950">
                <Zap className="w-3 h-3 text-white fill-white" />
              </div>
            )}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/traveler/${traveler.id}`} className="block">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-white font-semibold truncate">{traveler.name}</h3>
              {traveler.verified && <Shield className="w-4 h-4 text-blue-400 shrink-0" />}
              {traveler.isBoosted && (
                <Badge className="bg-gradient-to-r from-yellow-500/25 to-orange-500/25 text-yellow-200 border-yellow-500/40 text-[10px] shrink-0 px-1.5 py-0">
                  <Zap className="w-3 h-3 mr-0.5 fill-current" />
                  Boosted
                </Badge>
              )}
            </div>
          </Link>
          {traveler.location && (
            <p className="text-purple-300 text-sm mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{traveler.location}</span>
            </p>
          )}
          {traveler.matchScore != null && (
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className={`text-xs font-medium ${match.color}`}>
                {traveler.matchScore}% · {match.level}
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-1.5">
            {(traveler.interests || []).slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <Button
          size="sm"
          disabled={connectLoading || connectionStatus === 'accepted' || connectionStatus === 'pending_sent'}
          onClick={() => {
            if (connectionStatus === 'pending_received') {
              window.location.href = '/connections';
              return;
            }
            onConnect?.(traveler);
          }}
          className={`w-full sm:w-auto sm:self-center shrink-0 ${
            connectionStatus === 'accepted'
              ? 'bg-green-600/80 hover:bg-green-600'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
          }`}
        >
          {connectLoading ? '...' : connectLabel}
        </Button>
      </div>
    </motion.div>
  );
}
