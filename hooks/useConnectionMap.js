'use client';

import { useState, useEffect, useCallback } from 'react';
import { connectionApi } from '@/lib/apiClient';

export function useConnectionMap(token) {
  const [map, setMap] = useState({});

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      const data = await connectionApi.list(null, token);
      const next = {};
      for (const c of data.connections || []) {
        const uid = c.user?.id;
        if (!uid) continue;
        if (c.status === 'accepted') next[uid] = 'accepted';
        else if (c.status === 'pending') next[uid] = c.direction === 'sent' ? 'pending_sent' : 'pending_received';
      }
      setMap(next);
    } catch {
      /* ignore */
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { connectionMap: map, refreshConnections: refresh };
}
