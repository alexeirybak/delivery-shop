import { UserDataOrNull } from "@/app/auth/types";
import { authClient } from "@/lib/auth-client";
import { create } from "zustand";

type AuthState = {
  isAuth: boolean;
  user: UserDataOrNull | undefined;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  fetchUserData: () => Promise<void>;
  updateUser: (data: Partial<NonNullable<UserDataOrNull>>) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuth: false,
  user: undefined,
  isLoading: false,

  login: () => {
    set({ isAuth: true });
    get().fetchUserData();
  },

  checkAuth: async () => {
    // Если уже есть user, сразу возвращаем true
    if (get().user) {
      return true;
    }

    set({ isLoading: true });

    try {
      const response = await fetch("/api/auth/check-session", {
        cache: "no-store",
      });

      if (!response.ok) {
        set({ isAuth: false, user: null, isLoading: false });
        return false;
      }

      const data = await response.json();

      if (data.isAuth) {
        set({ isAuth: true });
        await get().fetchUserData();
        return true;
      } else {
        set({ isAuth: false, user: null, isLoading: false });
        return false;
      }
    } catch (error) {
      console.error("Check auth error:", error);
      set({ isAuth: false, user: null, isLoading: false });
      return false;
    }
  },

  fetchUserData: async () => {
    try {
      const response = await fetch("/api/auth/user", {
        cache: "no-store",
      });

      if (response.status === 401 || response.status === 403) {
        throw new Error("Unauthorized");
      }

      if (!response.ok) {
        throw new Error("Ошибка получения данных");
      }

      const userData = await response.json();
      set({ user: userData, isAuth: true, isLoading: false });
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
      set({ user: null, isAuth: false, isLoading: false });
    }
  },

  updateUser: (data) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },

  logout: async () => {
    try {
      await authClient.signOut();
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ isAuth: false, user: null, isLoading: false });
    }
  },
}));
