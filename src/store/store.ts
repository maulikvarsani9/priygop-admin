import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/api";

interface StoreState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;

  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      isAuthenticated: false,
      token: null,
      setToken: (token) => set({ token }),
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // UI State
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      error: null,
      setError: (error) => set({ error }),
    }),
    {
      name: "priygop-admin-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        token: state.token,
      }),
    }
  )
);

