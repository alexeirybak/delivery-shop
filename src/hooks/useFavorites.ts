"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export const useFavorites = () => {
  const { user } = useAuthStore();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
        }
      } catch (error) {
        console.error("Ошибка загрузки избранного:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user?.id]);

  const toggleFavorite = async (productId: string) => {
    if (!user?.id) return;

    const isCurrentlyFavorite = favorites.includes(productId);
    const action = isCurrentlyFavorite ? "remove" : "add";
    
    const response = await fetch("/api/users/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productId,
        action
      }),
    });

    if (response.ok) {
      if (isCurrentlyFavorite) {
        setFavorites(prev => prev.filter(id => id !== productId));
      } else {
        setFavorites(prev => [...prev, productId]);
      }
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return {
    toggleFavorite, 
    isFavorite,    
    isLoading,    
  };
};