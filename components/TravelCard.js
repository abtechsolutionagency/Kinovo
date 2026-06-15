'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getDestinationMeta } from '@/lib/destinations';
import { resolveMediaUrl } from '@/lib/avatarUrl';

export function TravelCard({ travel, index = 0 }) {
  const meta = getDestinationMeta(travel.destinationId);
  const image =
    resolveMediaUrl(travel.image) ||
    meta.image ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : null;

  return (
    <Link href={`/travel/${travel.id}`}>
      <motion.article
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer h-full"
      >
        <div className="aspect-[4/5] relative">
          <img src={image} alt={travel.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge className="capitalize bg-purple-600/90 text-white text-[10px] border-0">
              {travel.status || 'planned'}
            </Badge>
            {travel.travelStyle && (
              <Badge className="bg-pink-600/80 text-white text-[10px] border-0 capitalize">
                {travel.travelStyle}
              </Badge>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{travel.title}</h3>
            <p className="text-purple-300 text-xs mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              {travel.destinationName || meta.name}
            </p>
            <div className="flex items-center gap-2 text-purple-400 text-xs">
              {travel.startDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {fmtDate(travel.startDate)}
                  {travel.endDate ? ` – ${fmtDate(travel.endDate)}` : ''}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
