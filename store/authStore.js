import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isPremium: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setPremium: (isPremium) => set({ isPremium }),
      logout: () => set({ user: null, isAuthenticated: false, isPremium: false }),
    }),
    {
      name: 'kinovo-auth',
    }
  )
);
