"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import IconHeart from "./svg/IconHeart";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  iconSize?: number;
  redirectToFavorites?: boolean;
}

const FavoriteButton = ({
  productId,
  className = "",
  iconSize = 24,
  redirectToFavorites = false,
}: FavoriteButtonProps) => {
  const { isAuth, user } = useAuthStore();
  const { toggleFavorite, isFavorite, isLoading } = useFavorites();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (!isAuth) {
      router.push("/login");
      return;
    }

    if (redirectToFavorites && user?._id) {
      router.push(`/favorites`);
      return;
    }

    setIsProcessing(true);
    try {
      await toggleFavorite(productId);
    } catch (error) {
      console.error("Не удалось переключить избранное:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isActive = isAuth && isFavorite(productId);
  const disabled = isLoading || isProcessing;

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      className={`
        ${className}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
        flex items-center justify-center 
        duration-300
      `}
      title={isActive ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <IconHeart 
        size={iconSize} 
        isActive={isActive} 
        isHovered={isHovered} 
      />
    </button>
  );
};

export default FavoriteButton;