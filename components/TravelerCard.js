'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Shield } from 'lucide-react';
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
      className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl p-4 hover:border-purple-500/50 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        <Link href={`/traveler/${traveler.id}`}>
          <img
            src={resolveAvatarUrl(traveler.avatar)}
            alt={traveler.name}
            className="w-16 h-16 rounded-full object-cover border border-purple-500/30 bg-purple-500/20"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/traveler/${traveler.id}`} className="block">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold truncate">{traveler.name}</h3>
              {traveler.verified && <Shield className="w-4 h-4 text-blue-400 shrink-0" />}
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
