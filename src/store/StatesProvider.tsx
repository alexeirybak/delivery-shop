"use client";

import { useEffect } from "react";
import { useAuthStore } from "./authStore";
import { useCartStore } from "./cartStore";

const StatesProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth, user } = useAuthStore();
  const { fetchCart, clearCart } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      const isManagerOrAdmin = user.role === "manager" || user.role === "admin";
      if (!isManagerOrAdmin) {
        fetchCart();
      } else {
        clearCart();
      }
    } else {
      clearCart();
    }
  }, [user, fetchCart, clearCart]);

  return <>{children}</>;
};

export default StatesProvider;
