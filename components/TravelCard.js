'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import { getDestinationMeta } from '@/lib/destinations';

export function TravelCard({ travel, index = 0 }) {
  const meta = getDestinationMeta(travel.destinationId);
  const image =
    travel.image ||
    meta.image ||
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800';

  return (
    <Link href={`/travel/${travel.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-lg border border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer"
      >
        <div className="aspect-[4/5] relative">
          <img src={image} alt={travel.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-purple-600/80 text-white text-xs capitalize">
            {travel.status}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-bold text-white mb-1">{travel.destinationName || meta.name}</h3>
            <p className="text-purple-300 text-xs mb-2 line-clamp-1">{travel.title}</p>
            <div className="flex items-center gap-3 text-purple-400 text-xs">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {meta.country || meta.name}
              </span>
              {travel.startDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(travel.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
