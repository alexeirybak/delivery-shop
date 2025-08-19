import { create } from "zustand";

type AuthState = {
  isAuth: boolean;
  userName: string;
  login: (name: string) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  isAuth: false,
  userName: "",
  login: (name) => set({ isAuth: true, userName: name }),
}));

// import { create } from 'zustand';

// import { persist } from 'zustand/middleware';

// type AuthState = {
//   isAuth: boolean;
//   userName: string;
//   login: (name: string) => void;
//   logout: () => void;
//   hydrate: () => void;
// };

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       isAuth: false,
//       userName: '',
//       login: (name) => set({ isAuth: true, userName: name }),
//       logout: () => set({ isAuth: false, userName: '' }),
//       hydrate: () => {} // Для гидратации на клиенте
//     }),
//     {
//       name: 'auth-storage', // Ключ для localStorage
//       onRehydrateStorage: () => (state) => {
//         state?.hydrate();
//       }
//     }
//   )
// );

