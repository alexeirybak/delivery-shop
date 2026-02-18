"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { getAvatarByGender } from "../../../utils/getAvatarByGender";
import { checkAvatarExists } from "../../../utils/avatarUtils";
import MiniLoader from "../MiniLoader";

const Profile = () => {
  const { isAuth, user, logout, checkAuth, isLoading } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getDisplayName = () => {
    if (!user?.name) return <MiniLoader />;

    if (user.role === "manager") {
      return "Менеджер";
    } else if (user.role === "admin") {
      return "Администратор";
    }

    return user.name;
  };

  const isManagerOrAdmin = () => {
    return user?.role === "manager" || user?.role === "admin";
  };

  useEffect(() => {
    setLastUpdate(Date.now());
  }, [user]);

  useEffect(() => {
    const checkAvatar = async () => {
      if (user?.id) {
        try {
          const exists = await checkAvatarExists(user.id);

          if (exists) {
            setAvatarSrc(`/api/auth/avatar/${user.id}`);
          } else {
            setAvatarSrc(getAvatarByGender(user.gender));
          }
        } catch {
          setAvatarSrc(getAvatarByGender(user.gender));
        }
      } else if (user?.gender) {
        setAvatarSrc(getAvatarByGender(user.gender));
      }
    };

    checkAvatar();
  }, [user, lastUpdate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();

      router.replace("/");
    } catch (error) {
      console.error("Не удалось выйти:", error);
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  const handleAvatarError = () => {
    if (user?.gender) {
      setAvatarSrc(getAvatarByGender(user.gender));
    }
  };

  if (isLoading) {
    return (
      <div className="ml-6 w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (!isAuth) {
    return (
      <Link
        href="/login"
        className="ml-6 w-10 xl:w-[157px] flex justify-between items-center gap-x-2 p-2 rounded text-white text-base bg-[#ff6633] hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) duration-300 cursor-pointer"
      >
        <div className="w-[109px] justify-center hidden xl:flex">
          <p>Войти</p>
        </div>
        <Image
          src="/icons-header/icon-entry.svg"
          alt="Войти"
          width={24}
          height={24}
        />
      </Link>
    );
  }

  return (
    <div className="relative ml-6" ref={menuRef}>
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={toggleMenu}
      >
        <Image
          src={avatarSrc || getAvatarByGender(user?.gender)}
          alt="Ваш профиль"
          width={40}
          height={40}
          onError={handleAvatarError}
          className="min-w-10 min-h-10 md:block xl:block rounded-full object-cover"
        />
        <p className="hidden xl:block cursor-pointer p-2.5">
          {getDisplayName()}
        </p>
        <div className="hidden xl:block">
          <Image
            src="/icons-header/icon-arrow.svg"
            alt="Меню профиля"
            width={24}
            height={24}
            sizes="24px"
            className={`transform transition-transform duration-300 ${
              isMenuOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Выпадающее меню */}
      <div
        className={`absolute right-0 bg-white rounded shadow-button-secondary overflow-hidden z-50 ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        } transition-all duration-300 min-w-[200px] ${
          isMobile ? "bottom-full top-auto mb-6" : "top-full mt-6"
        }`}
      >
        <Link
          href="/user-profile"
          className="block px-4 py-3 text-main-text hover:text-[#ff6633] duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          Профиль
        </Link>
        <Link
          href="/"
          className="block px-4 py-3 text-main-text hover:text-[#ff6633] duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          Главная
        </Link>
        {isManagerOrAdmin() && (
          <Link
            href="/administrator"
            className="block px-4 py-3 text-main-text hover:text-[#ff6633] duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Панель управления
          </Link>
        )}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full text-left px-4 py-3 text-main-text hover:text-[#ff6633] duration-300 border-t border-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? "Выход..." : "Выйти"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
