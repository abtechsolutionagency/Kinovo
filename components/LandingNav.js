'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { resolveAvatarUrl } from '@/lib/avatarUrl';

export function LandingNav({ joinLabel = 'Join Beta' }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/profile"
          className="flex items-center gap-2 rounded-full pr-3 hover:bg-white/5 transition-colors"
        >
          <img
            src={resolveAvatarUrl(user.avatar)}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border border-purple-500/30"
          />
          <span className="text-white text-sm font-medium hidden sm:inline max-w-[120px] truncate">
            {user.name}
          </span>
        </Link>
        <Link href="/travels">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25">
            Open App
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/auth">
        <Button variant="ghost" className="hidden sm:inline-flex text-purple-200 hover:text-white hover:bg-white/5">
          Sign In
        </Button>
      </Link>
      <Link href="/auth">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25">
          {joinLabel}
        </Button>
      </Link>
    </div>
  );
}
