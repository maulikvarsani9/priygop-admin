import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, LoginResponse } from "../types/api";
import { apiClient, apiEndpoints } from "../lib/api";
import { navigateToLogin } from "../utils/navigation";
import type { AxiosResponse } from "axios";

interface StoreState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  isInitialized: boolean;
  token: string | null;
  refreshToken: string | null;
  setTokens: (token: string, refreshToken?: string) => void;
  clearTokens: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  initializeAuth: () => void;

  // UI State
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      isAuthenticated: false,
      isInitialized: false,
      token: null,
      refreshToken: null,
      setTokens: (token, refreshToken) => set({ token, refreshToken }),
      clearTokens: () => set({ token: null, refreshToken: null }),

      login: async (email: string, password: string) => {
        try {
          console.log("=== LOGIN START ===");

          const { data } = await apiClient.post<AxiosResponse>(
            apiEndpoints.auth.login,
            {
              email,
              password,
            }
          );
          const { user, token, refreshToken } = data as LoginResponse;
          console.log("Extracted data:", {
            user,
            token: token ? "present" : "missing",
            refreshToken: refreshToken ? "present" : "missing",
          });

          if (!token) {
            throw new Error("No token received from server");
          }

          if (!user) {
            throw new Error("No user data received from server");
          }

          set({ user, token, refreshToken, isAuthenticated: true });
          console.log("=== LOGIN SUCCESS ===");
          return true;
        } catch (error) {
          console.log("=== LOGIN ERROR ===");
          console.error("Login failed:", error);
          throw error;
        }
      },

      logout: async () => {
        try {
          const { token } = get();

          // Call logout API if we have a token
          if (token) {
            try {
              await apiClient.post(apiEndpoints.auth.logout);
              console.log("Logout API called successfully");
            } catch (error) {
              console.error("Logout API error:", error);
              // Continue with local logout even if API fails
            }
          }

          // Clear store state
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          console.log("Store cleared after logout");

          // Navigate to login page
          navigateToLogin();
        } catch (error) {
          console.error("Logout error:", error);
          // Clear store state even if there's an error
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
          });
          // Navigate to login page even on error
          navigateToLogin();
        }
      },

      initializeAuth: () => {
        const { isInitialized } = get();
        console.log("=== INITIALIZE AUTH START ===");

        if (isInitialized) {
          console.log("Already initialized, skipping");
          return;
        }

        // Get current store state
        const { user, token, refreshToken } = get();

        console.log("Current store state:", {
          user: user ? "present" : "missing",
          token: token ? "present" : "missing",
          refreshToken: refreshToken ? "present" : "missing",
        });

        if (token && user) {
          console.log("Auth data found in store");
          set({ isAuthenticated: true, isInitialized: true });
        } else {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isInitialized: true,
          });
          console.log("No auth data in store, set unauthenticated");
        }
        console.log("=== INITIALIZE AUTH END ===");
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
        refreshToken: state.refreshToken,
      }),
    }
  )
);

