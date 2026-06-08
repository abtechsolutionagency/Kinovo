import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/lib/apiClient';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isPremium: false,
      isInitializing: true,

      setAuth: ({ user, token }) =>
        set({
          user,
          token,
          isAuthenticated: !!user,
          isPremium: user?.isPremium ?? false,
          isInitializing: false,
        }),
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isPremium: user?.isPremium ?? false,
        }),
      setPremium: (isPremium) => set({ isPremium }),
      setInitializing: (isInitializing) => set({ isInitializing }),
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isPremium: false,
          isInitializing: false,
        }),
      logoutAsync: async () => {
        const { token } = get();
        try {
          if (token) {
            await authApi.logout(token);
          }
        } catch {
          // Clear local session even if API fails
        }
        get().logout();
      },
      refreshSession: async () => {
        const { token } = get();
        if (!token) {
          set({ isInitializing: false });
          return;
        }
        try {
          const data = await authApi.me(token);
          set({
            user: data.user,
            isAuthenticated: true,
            isPremium: data.user?.isPremium ?? false,
            isInitializing: false,
          });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: 'kinovo-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        isPremium: state.isPremium,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          state.refreshSession();
        } else {
          useAuthStore.setState({ isInitializing: false });
        }
      },
    }
  )
);

export function getAuthToken() {
  return useAuthStore.getState().token;
}
