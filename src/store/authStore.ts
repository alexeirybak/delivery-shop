import { create } from "zustand";
import { authClient } from "@/lib/auth-client";

type AuthState = {
  isAuth: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  isLoading: false,

  login: () => set({ isAuth: true }),
  
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/auth/check-session');
      const isAuthenticated = response.ok;
      set({ isAuth: isAuthenticated, isLoading: false });
      return isAuthenticated;
    } catch (error) {
      console.error("Error checking authentication:", error);
      set({ isAuth: false, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await authClient.signOut();
    } finally {
      set({ isAuth: false });
    }
  }
}));