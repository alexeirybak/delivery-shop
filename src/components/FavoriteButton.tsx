"use client";

import { useAuthStore } from "@/store/authStore";
import IconHeart from "./svg/IconHeart";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorite";

const FavoriteButton = ({ productId }: { productId: string }) => {
  const { isAuth } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toggleFavorite, isFavorite, isLoading } = useFavorites();
  const router = useRouter();

  const handleClick = async () => {
    if (!isAuth) {
      router.push("/login");
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
      disabled={disabled}
      className={`
    w-8 h-8 p-2 bg-[#f3f2f1] hover:bg-[#fcd5ba] absolute top-2 right-2 rounded duration-300 z-10
    flex items-center justify-center 
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
  `}
      title={isActive ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <IconHeart isActive={isActive} />
    </button>
  );
};

export default FavoriteButton;
