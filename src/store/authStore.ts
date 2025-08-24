// Импорт клиента аутентификации Better-Auth
import { authClient } from "@/lib/auth-client";
// Импорт функции для создания хранилища Zustand
import { create } from "zustand";

// Тип данных пользователя
type UserData = {
  id: string; // Уникальный идентификатор пользователя
  name: string; // Имя пользователя
  surname: string; // Фамилия пользователя
  email: string; // Email адрес
  phoneNumber: string; // Номер телефона
  emailVerified: boolean; // Подтвержден ли email
  phoneNumberVerified: boolean; // Подтвержден ли номер телефона
  gender: string; // Пол пользователя
  birthdayDate?: string; // Дата рождения (опционально)
  location?: string; // Местоположение (опционально)
  region?: string; // Регион (опционально)
} | null; // Может быть null если пользователь не авторизован

// Тип состояния аутентификации
type AuthState = {
  isAuth: boolean; // Флаг авторизации (true/false)
  user: UserData; // Данные пользователя или null
  isLoading: boolean; // Флаг загрузки (показывает идет ли процесс загрузки)
  login: () => void; // Функция для входа (устанавливает isAuth = true)
  logout: () => Promise<void>; // Асинхронная функция для выхода
  checkAuth: () => Promise<boolean>; // Проверка статуса аутентификации
  fetchUserData: () => Promise<void>; // Загрузка данных пользователя
};

// Создание хранилища аутентификации с помощью Zustand
export const useAuthStore = create<AuthState>((set, get) => ({
  // Начальное состояние
  isAuth: false, // По умолчанию не авторизован
  user: null, // Данные пользователя отсутствуют
  isLoading: false, // Загрузка не активна

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

      // Если ответ не успешный (не 200-299)
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
      // Запрашиваем данные пользователя с API
      const response = await fetch("/api/auth/user");

      // Если ответ не успешный
      if (!response.ok) {
        throw new Error("Ошибка получения данных"); // Бросаем ошибку
      }

      // Парсим данные пользователя
      const userData = await response.json();
      // Обновляем состояние - сохраняем данные пользователя и выключаем загрузку
      set({ user: userData, isLoading: false });
    } catch (error) {
      console.error("Fetch user error:", error); // Логируем ошибку
      // При ошибке сбрасываем состояние авторизации
      set({ isAuth: false, user: null, isLoading: false });
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