import { create } from 'zustand';

type AuthState = {
  isAuth: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  userName: null,
  login: (name) => set({ isAuth: true, userName: name }),
  logout: () => set({ isAuth: false, userName: null }),
}));