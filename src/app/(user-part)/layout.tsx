"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CyberLoader } from "./user-dashboard/_components/CyberLoader";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuth, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && (!isAuth || !user)) {
      router.replace("/auth/login");
    }
  }, [isLoading, isAuth, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CyberLoader />
      </div>
    );
  }

  if (isAuth && user) {
    return <>{children}</>;
  }

  return null;
};

export default UserLayout;
