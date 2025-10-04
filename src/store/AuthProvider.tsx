"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth, user } = useAuthStore();
  const { fetchCart, clearCart } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Синхронизируем корзину при изменении пользователя
  useEffect(() => {
    if (user) {
      const isManagerOrAdmin = user.role === "manager" || user.role === "admin";
      if (!isManagerOrAdmin) {
        fetchCart();
      } else {
        clearCart(); // Очищаем корзину для менеджеров/админов
      }
    } else {
      clearCart(); // Очищаем корзину при выходе
    }
  }, [user, fetchCart, clearCart]);

  return <>{children}</>;
};

export default AuthProvider;