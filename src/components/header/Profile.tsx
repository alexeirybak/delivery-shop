"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import iconArrow from "/public/icons-header/icon-arrow.svg";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { getAvatarPath } from "../../../utils/defaultAvatar";

const Profile = () => {
  const { isAuth, user, logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрытие меню при клике вне области
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

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Получаем путь к аватару через утилиту
  const avatarSrc = getAvatarPath(user);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    // Используем утилиту для получения дефолтного аватара
    target.src = getAvatarPath(null, user?.gender);
  };

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
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={toggleMenu}>
        <Image
          src={avatarSrc}
          alt="Ваш профиль"
          width={40}
          height={40}
          className="min-w-10 min-h-10 md:block xl:block"
          onError={handleImageError}
        />
        
        <p className="hidden xl:block cursor-pointer p-2.5">
          {user?.name}
        </p>
        
        {/* Стрелка - скрыта на мобильных */}
        <div className="hidden md:block">
          <Image
            src={iconArrow}
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
        className={`absolute right-0 top-full mt-6 bg-white rounded-md shadow-lg overflow-hidden z-50 ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        } transition-all duration-300 min-w-[200px]`}
      >
        <Link
          href="/user-profile"
          className="block px-4 py-3 text-[#414141] hover:text-[#ff6633] duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          Профиль
        </Link>
        <Link
          href="/"
          className="block px-4 py-3 text-[#414141] hover:text-[#ff6633] duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          Главная
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 text-[#414141] hover:text-[#ff6633] duration-300 border-t border-gray-200 cursor-pointer"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Profile;