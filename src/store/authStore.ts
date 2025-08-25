import { authClient } from "@/lib/auth-client";
import { create } from "zustand";

// Тип данных пользователя
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

  // Функция входа - синхронно устанавливает флаг авторизации
  login: () => {
    set({ isAuth: true }); // Устанавливаем флаг авторизации в true
    // Автоматически загружаем данные после установки флага авторизации
    get().fetchUserData(); // Вызываем асинхронную загрузку данных пользователя
  },

  // Асинхронная функция проверки статуса аутентификации
  checkAuth: async () => {
    try {
      set({ isLoading: true }); // Включаем индикатор загрузки
      // Отправляем запрос к API для проверки сессии
      const response = await fetch("/api/auth/check-session");

      if (!response.ok) {
        set({ isAuth: false, user: null, isLoading: false }); // Сбрасываем состояние
        return false; // Возвращаем false - не авторизован
      }

      // Парсим JSON ответ
      const data = await response.json();

      // Если API подтвердил авторизацию
      if (data.isAuth) {
        set({ isAuth: true }); // Устанавливаем флаг авторизации
        await get().fetchUserData(); // Загружаем данные пользователя
      } else {
        // Если не авторизован - сбрасываем состояние
        set({ isAuth: false, user: null, isLoading: false });
      }

      // Возвращаем статус авторизации
      return data.isAuth;
    } catch {
      // В случае любой ошибки - сбрасываем состояние
      set({ isAuth: false, user: null, isLoading: false });
      return false; // Возвращаем false
    }
  },

  // Асинхронная функция загрузки данных пользователя
  fetchUserData: async () => {
    try {
      set({ isLoading: true }); 
      const response = await fetch("/api/auth/user");

      // Если сервер наконец-то возвращает 401/403 для неавторизованных
      if (response.status === 401 || response.status === 403) {
        // Выбрасываем ошибку, но особую, не сбрасывая состояние
        throw new Error("Unauthorized");
      }

      // Обрабатываем другие ошибки (например, 500)
      if (!response.ok) {
        throw new Error("Ошибка получения данных");
      }

      const userData = await response.json();
      set({ user: userData, isLoading: false }); // Успех! Устанавливаем данные
    } catch (error) {
      console.error("Ошибка загрузки данных пользователя:", error);
      // Только сбрасываем данные пользователя и выключаем загрузку,
      // НО НЕ ТРОГАЕМ isAuth! Это задача checkAuth или logout.
      set({ user: null, isLoading: false });

      // Если ошибка именно из-за авторизации, можно также сбросить isAuth,
      // но это уже ответственность fetchUserData.
      // Лучше всего просто просигнализировать о проблеме, а решение о сбросе isAuth оставить для checkAuth.
      if (error === "Unauthorized") {
        set({ isAuth: false });
      }
    }
  },

  // Асинхронная функция выхода из системы
  logout: async () => {
    try {
      // 1. Выход из Better-Auth (очищает их сессии)
      await authClient.signOut();

      // 2. Очищаем кастомную сессию через API
      await fetch("/api/auth/logout", {
        method: "POST", // POST запрос
        credentials: "include", // Включаем куки в запрос
      });
    } finally {
      // В блоке finally (выполняется всегда, даже при ошибках)
      // Сбрасываем состояние хранилища - пользователь больше не авторизован
      set({ isAuth: false, user: null });
    }
  },
}));
