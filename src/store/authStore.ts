import { authClient } from "@/lib/auth-client";
import { UserDataOrNull } from "@/types/userData";
import { create } from "zustand";


type AuthState = {
  isAuth: boolean;
  user: UserDataOrNull;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  fetchUserData: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuth: false,
  user: null,
  isLoading: false,

  login: () => {
    set({ isAuth: true });
    get().fetchUserData();
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/auth/check-session");

      if (!response.ok) {
        set({ isAuth: false, user: null, isLoading: false });
        return false;
      }

      const data = await response.json();

      if (data.isAuth) {
        set({ isAuth: true });
        await get().fetchUserData();
      } else {
        set({ isAuth: false, user: null, isLoading: false });
      }

      return data.isAuth;
    } catch {
      set({ isAuth: false, user: null, isLoading: false });
      return false;
    }
  },

  fetchUserData: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/auth/user");

      if (response.status === 401 || response.status === 403) {
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Ошибка получения данных");
      }

      const userData = await response.json();

      set({ user: userData, isLoading: false });
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
      set({ user: null, isLoading: false });

      if (error === "Unauthorized") {
        set({ isAuth: false });
      }
    }
  },

  logout: async () => {
    try {
      await authClient.signOut();

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      set({ isAuth: false, user: null });
    }
  },
}));
