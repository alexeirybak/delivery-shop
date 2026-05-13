"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAvatarStore } from "@/store/avatarStore";

interface UseAvatarProps {
  userId?: string;
}

const useAvatar = ({ userId }: UseAvatarProps) => {
  const { user } = useAuthStore();
  const { setAvatarUrl, refreshAvatar } = useAvatarStore();
  const [customAvatar, setCustomAvatar] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const getDisplayAvatar = useCallback(() => {
    if (customAvatar) {
      return customAvatar;
    }
    if (user?.image) {
      return user.image;
    }
    return "";
  }, [customAvatar, user?.image]);

  const loadCustomAvatar = useCallback(async () => {
    if (!userId) {
      setCustomAvatar("");
      setAvatarUrl(null);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/auth/avatar/${userId}?t=${Date.now()}`,
      );

      if (response.ok) {
        const blob = await response.blob();

        if (blob.size > 0) {
          const avatarUrl = URL.createObjectURL(blob);
          setCustomAvatar(avatarUrl);
          setAvatarUrl(avatarUrl);
          return;
        }
      }

      setCustomAvatar("");
      setAvatarUrl(null);
    } catch (error) {
      console.error("Error loading custom avatar:", error);
      setCustomAvatar("");
      setAvatarUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId, setAvatarUrl]);

  useEffect(() => {
    loadCustomAvatar();
  }, [loadCustomAvatar]);

  useEffect(() => {
    return () => {
      if (customAvatar && customAvatar.startsWith("blob:")) {
        URL.revokeObjectURL(customAvatar);
      }
    };
  }, [customAvatar]);

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
          let errorMessage = "Ошибка загрузки";
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } catch {
            errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        await loadCustomAvatar();

        const userResponse = await fetch("/api/auth/user");
        const userData = await userResponse.json();
        useAuthStore.setState({ user: userData });

        refreshAvatar();

        return true;
      } catch (error) {
        console.error("Ошибка загрузки аватара:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [userId, loadCustomAvatar, refreshAvatar],
  );

  return {
    avatar: customAvatar,
    displayAvatar: getDisplayAvatar(),
    isLoading,
    loadCustomAvatar,
    uploadAvatar,
  };
};

export default useAvatar;
