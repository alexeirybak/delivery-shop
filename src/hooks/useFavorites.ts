"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export const useFavorites = () => {
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFavorites = async () => {
    
    if (!user?.id) {
      setFavorites([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/favorites?userId=${user.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
        console.error("Failed to load favorites:", response.status);
      }
    } catch (error) {
      console.error("Ошибка загрузки избранного:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (productId: string) => {

    if (!user?.id) return;

    try {
      const isCurrentlyFavorite = favorites.includes(productId);

      // Используем user.id вместо user._id
      const url = isCurrentlyFavorite
        ? `/api/users/favorites?userId=${user.id}&productId=${productId}`
        : `/api/users/favorites?userId=${user.id}`;

      const response = await fetch(url, {
        method: isCurrentlyFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: isCurrentlyFavorite ? undefined : JSON.stringify({ productId }),
      });

      console.log("Toggle response status:", response.status);

      if (response.ok) {
        if (isCurrentlyFavorite) {
          setFavorites((prev) => prev.filter((id) => id !== productId));
          console.log("Removed from favorites");
        } else {
          setFavorites((prev) => [...prev, productId]);
        }
      } else {
        console.error("Failed to toggle favorite:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
      }
    } catch (error) {
      console.error("Ошибка переключения избранного:", error);
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.includes(productId);
  };

  useEffect(() => {
    console.log("User changed, loading favorites");
    loadFavorites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Зависимость от user.id

  return {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    reloadFavorites: loadFavorites,
  };
};