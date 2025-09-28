"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import IconHeart from "./svg/IconHeart";

const FavoriteButton = ({ productId }: { productId: string }) => {
  const { isAuth, user } = useAuthStore();
  const { toggleFavorite, isFavorite, isLoading } = useFavorites();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (!isAuth) {
      router.push("/login");
      return;
    }

    if (user?._id) {
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
      disabled={disabled}
      className={`
    w-8 h-8 p-2 bg-[#f3f2f1] hover:bg-[#fcd5ba] absolute top-2 right-2 rounded duration-300 z-10
    flex items-center justify-center 
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
  `}
      title={isActive ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <IconHeart size={24} isActive={isActive} />
    </button>
  );
};

export default FavoriteButton;
