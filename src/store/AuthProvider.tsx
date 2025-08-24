"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // При загрузке приложения проверяем авторизацию
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
};