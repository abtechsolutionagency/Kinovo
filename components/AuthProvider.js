'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

const PUBLIC_PATHS = ['/', '/landing', '/auth', '/safety', '/admin/login'];
const AUTH_PATHS = ['/auth', '/auth/reset-password'];

export function AuthProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isInitializing, refreshSession } = useAuthStore();

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    if (isInitializing) return;

    const isPublic =
      PUBLIC_PATHS.some((p) => pathname === p) ||
      pathname.startsWith('/auth') ||
      pathname === '/admin/login';

    const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));
    const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';

    if (!isAuthenticated && !isPublic) {
      if (isAdminRoute) {
        router.replace('/admin/login');
      } else {
        router.replace('/auth');
      }
      return;
    }

    if (isAuthenticated && isAuthPage) {
      router.replace('/travels');
    }
  }, [isAuthenticated, isInitializing, pathname, router]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-purple-300 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}
