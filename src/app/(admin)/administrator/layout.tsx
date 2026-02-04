"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader } from "@/components/Loader";
import { ChevronUp } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verifyAccess = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    verifyAccess();
  }, [checkAuth]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 800);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isChecking) {
      const hasAccess =
        user && (user.role === "admin" || user.role === "manager");
      if (!hasAccess) {
        router.replace("/");
      }
    }
  }, [isChecking, router, user]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 800,
      behavior: "smooth",
    });
  };

  if (isLoading || isChecking) {
    return <Loader />;
  }

  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    return null;
  }

  return (
    <>
      {children}

      <button
        onClick={scrollToTop}
        className={`fixed z-50 w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 cursor-pointer duration-300 flex items-center justify-center ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        } right-6 bottom-6`}
        aria-label="Прокрутить вверх"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </>
  );
}
