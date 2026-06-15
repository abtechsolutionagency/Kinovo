'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function AdminGuard({ children }) {
  const router = useRouter();
  const { user, token, isAuthenticated, isInitializing } = useAuthStore();

  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated || !token) {
      router.replace('/admin/login');
      return;
    }
    if (user && user.role !== 'admin') {
      router.replace('/travels');
    }
  }, [isAuthenticated, isInitializing, token, user, router]);

  if (isInitializing || !isAuthenticated || !token) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return children;
}
