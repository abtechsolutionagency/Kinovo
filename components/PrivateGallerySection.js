'use client';

import { Images, Lock } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/AppPage';

export function PrivateGallerySection({
  photos = [],
  isConnected = false,
  hasPrivateGallery = false,
  isSelf = false,
  editHref = '/profile/edit',
}) {
  if (isSelf) {
    if (!photos.length) return null;
    return (
      <GlassCard className="mb-6 !p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-purple-200 font-semibold">
            <Images className="w-5 h-5 text-pink-400" />
            Private gallery
          </div>
          <Link href={editHref} className="text-purple-300 text-xs hover:text-white underline">
            Manage
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <img
              key={photo}
              src={photo}
              alt="Private"
              className="aspect-square w-full object-cover rounded-lg border border-purple-500/20"
            />
          ))}
        </div>
        <p className="text-purple-400 text-xs mt-3">
          Only your connections can see these photos on your profile.
        </p>
      </GlassCard>
    );
  }

  if (isConnected && photos.length > 0) {
    return (
      <GlassCard className="mb-6 !p-4">
        <div className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
          <Images className="w-5 h-5 text-pink-400" />
          Private gallery
        </div>
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <a key={photo} href={photo} target="_blank" rel="noopener noreferrer">
              <img
                src={photo}
                alt="Private"
                className="aspect-square w-full object-cover rounded-lg border border-purple-500/20 hover:border-pink-400/50 transition-colors"
              />
            </a>
          ))}
        </div>
        <p className="text-purple-400 text-xs mt-3">Shared with connections only.</p>
      </GlassCard>
    );
  }

  if (!isConnected && hasPrivateGallery) {
    return (
      <GlassCard className="mb-6 !p-4 border border-purple-500/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">Private gallery</p>
            <p className="text-purple-400 text-xs mt-1">
              Connect with this traveler to view their private photos.
            </p>
          </div>
        </div>
      </GlassCard>
    );
  }

  return null;
}
