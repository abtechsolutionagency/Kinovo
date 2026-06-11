'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDestinationMeta } from '@/lib/destinations';

export function GroupCard({ group, index = 0, onJoin, joinLoading = false }) {
  const meta = getDestinationMeta(group.destinationId);
  const image =
    group.image ||
    meta.image ||
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/5 backdrop-blur-lg border border-purple-500/20 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all"
    >
      <Link href={`/groups/${group.id}`}>
        <div className="aspect-[16/9] relative">
          <img src={image} alt={group.title} className="w-full h-full object-cover" />
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-lg text-white text-sm">
            {group.memberCount}/{group.maxMembers} members
          </div>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 text-purple-400 text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span>{meta.name}</span>
        </div>
        <Link href={`/groups/${group.id}`}>
          <h3 className="text-white font-bold text-lg mb-2 hover:text-purple-200">{group.title}</h3>
        </Link>
        <p className="text-purple-300 text-sm mb-3 line-clamp-2">{group.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-purple-400 text-sm">
            {group.date
              ? new Date(group.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Date TBD'}
          </span>
          {group.isMember ? (
            <Button size="sm" variant="outline" className="border-green-500/30 text-green-300" disabled>
              <Users className="w-4 h-4 mr-1" />
              Joined
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={joinLoading || group.memberCount >= group.maxMembers}
              onClick={() => onJoin?.(group)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {joinLoading ? 'Joining...' : 'Join Group'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
