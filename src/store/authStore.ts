// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Функция для получения аватара по умолчанию
const getDefaultAvatar = (gender: string = 'male') => {
  return `/images/graphics/default-avatars/${gender === 'female' ? 'female' : 'male'}.png`;
};

export interface User {
  _id: string;
  phoneNumber: string;
  surname: string;
  name: string;
  region: string;
  location: string;
  email?: string;
  gender: string;
  card?: string;
  hasCard?: boolean;
  avatar?: string;
  emailVerified?: boolean; // Добавляем поле верификации
  isPhoneRegistration?: boolean; // Флаг регистрации по телефону
}

type AuthState = {
  isAuth: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      user: null,
      login: (userData) => set({ 
        isAuth: true, 
        user: {
          ...userData,
          avatar: userData.avatar || getDefaultAvatar(userData.gender)
        }
      }),
      logout: () => set({ isAuth: false, user: null }),
      updateUser: (updates) => 
        set((state) => ({
          user: state.user ? { 
            ...state.user, 
            ...updates,
            avatar: updates.avatar || getDefaultAvatar(updates.gender || state.user?.gender)
          } : null
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);