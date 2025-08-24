import { authClient } from "@/lib/auth-client";
import { create } from "zustand";

type UserData = {
  id: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  phoneNumberVerified: boolean;
  gender: string;
  birthdayDate?: string;
  location?: string;
  region?: string;
} | null;

type AuthState = {
  isAuth: boolean;
  user: UserData;
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
    // Автоматически загружаем данные после установки флага авторизации
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
        await get().fetchUserData(); // Загружаем данные
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
      const response = await fetch("/api/auth/user");

      if (!response.ok) {
        throw new Error("Ошибка получения данных");
      }

      const userData = await response.json();
      set({ user: userData, isLoading: false });
    } catch (error) {
      console.error("Fetch user error:", error);
      set({ isAuth: false, user: null, isLoading: false });
    }
  },

  logout: async () => {
    try {
      // 1. Выход из Better-Auth (очищает их сессии)
      await authClient.signOut();

      // 2. Очищаем кастомную сессию через API
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      set({ isAuth: false, user: null });
    }
  },
}));
