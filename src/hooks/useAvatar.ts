"use client";

import { useCallback, useEffect, useState } from "react";
import { getAvatarByGender } from "../../utils/getAvatarByGender";
import { useAuthStore } from "@/store/authStore";

const useAvatar = () => {
  const [currentAvatar, setCurrentAvatar] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, fetchUserData } = useAuthStore();

  const userId = user?.id; 
  const userHasAvatar = user?.hasAvatar; 
  const gender = user?.gender; 

  const getDisplayAvatar = useCallback(() => {
    return currentAvatar || getAvatarByGender(gender || "default");
  }, [currentAvatar, gender]);

  const loadAvatar = useCallback(async () => {
    // Проверяем наличие аватара
    if (!userId) {
      setCurrentAvatar(getAvatarByGender(gender || "default"));
      return;
    }

    // Если у пользователя нет аватара в БД, используем дефолтный
    if (userHasAvatar === false) {
      setCurrentAvatar(getAvatarByGender(gender || "default"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/auth/avatar/${userId}?t=${Date.now()}`
      );

      if (response.ok) {
        const blob = await response.blob();

        if (blob.size > 0) {
          const avatarUrl = URL.createObjectURL(blob);
          setCurrentAvatar(avatarUrl);
          return;
        }
      }

      // Если аватар не найден, но в БД указано что он есть - это ошибка
      console.warn("Аватар не найден, хотя в БД указано hasAvatar: true");
      setCurrentAvatar(getAvatarByGender(gender || "default"));
    } catch (error) {
      console.error("Error loading avatar:", error);
      setCurrentAvatar(getAvatarByGender(gender || "default"));
    } finally {
      setIsLoading(false);
    }
  }, [gender, userId, userHasAvatar]); // Добавили userHasAvatar в зависимости

  useEffect(() => {
    loadAvatar();
  }, [loadAvatar]);

  useEffect(() => {
    return () => {
      if (currentAvatar && currentAvatar.startsWith("blob:")) {
        URL.revokeObjectURL(currentAvatar);
      }
    };
  }, [currentAvatar]);

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!userId) {
        throw new Error("Нужен идентификатор пользователя");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Пожалуйста, выберите изображение");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Размер файла не должен превышать 5MB");
      }

      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("userId", userId);

        const response = await fetch("/api/auth/upload-avatar", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Ошибка загрузки");
        }

        // Перезагружаем аватар и данные пользователя
        await loadAvatar();
        await fetchUserData(); // Это должно обновить hasAvatar в стейте

        return true;
      } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchUserData, loadAvatar, userId]
  );

  return {
    avatar: currentAvatar,
    displayAvatar: getDisplayAvatar(),
    isLoading,
    loadAvatar,
    uploadAvatar,
    getDisplayAvatar,
  };
};

export default useAvatar;