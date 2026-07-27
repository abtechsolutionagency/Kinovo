'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { connectSocket, disconnectSocket } from '@/lib/socket';

export function PresenceProvider({ children }) {
  const { isAuthenticated, isInitializing } = useAuthStore();

  useEffect(() => {
    if (isInitializing) return;

    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    connectSocket();
  }, [isAuthenticated, isInitializing]);

  return children;
}
