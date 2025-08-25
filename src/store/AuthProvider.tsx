"use client";

import { useEffect } from "react";
import { useAuthStore } from "./authStore";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
};

export default AuthProvider;
