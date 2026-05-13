"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Home,
  Shield,
  ChevronDown,
  ArrowRight,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import "./styles/profile.css";
import { checkAvatarExists } from "@/utils/checkAvatar";

const Profile = () => {
  const { isAuth, user, logout, checkAuth, isLoading } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>("");
  const [hasAvatar, setHasAvatar] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getDisplayName = () => {
    if (!user?.name) return "Профиль";
    if (user.role === "manager") return "Менеджер";
    if (user.role === "admin") return "Администратор";
    return user.name;
  };

  const isAdmin = () => user?.role === "admin";
  const isManager = () => user?.role === "manager";
  const isManagerOrAdmin = () => isManager() || isAdmin();

  useEffect(() => {
    setLastUpdate(Date.now());
  }, [user]);

  useEffect(() => {
    const checkAvatar = async () => {
      if (user?.id) {
        try {
          const exist = await checkAvatarExists(user.id);
          if (exist) {
            setAvatarSrc(`/api/auth/avatar/${user.id}?t=${Date.now()}`);
            setHasAvatar(true);
          } else if (user?.image) {
            setAvatarSrc(user.image);
            setHasAvatar(true);
          } else {
            setAvatarSrc("");
            setHasAvatar(false);
          }
        } catch {
          setAvatarSrc("");
          setHasAvatar(false);
        }
      }
    };

    checkAvatar();
  }, [user, lastUpdate]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
    setHasAvatar(false);
    setAvatarSrc("");
  };

  if (isLoading) {
    return <div className="profile-skeleton"></div>;
  }

  if (!isAuth) {
    return (
      <Link href="/auth/login" className="login-button">
        <span>Войти</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    );
  }

  return (
    <div className="profile-container" ref={menuRef}>
      <button
        className="profile-trigger"
        onClick={toggleMenu}
        aria-label="Профиль"
      >
        <div className="profile-avatar">
          {hasAvatar && avatarSrc ? (
            <Image
              src={avatarSrc}
              alt="Ваш профиль"
              width={40}
              height={40}
              onError={handleAvatarError}
              className="w-full h-full object-cover"
              unoptimized={true} 
            />
          ) : (
            <div className="profile-avatar-placeholder">
              <User className="w-5 h-5" />
            </div>
          )}
        </div>

        <span className="profile-name">{getDisplayName()}</span>
        <ChevronDown
          className={`profile-chevron ${isMenuOpen ? "rotated" : ""}`}
        />
      </button>

      <div className={`profile-dropdown ${isMenuOpen ? "open" : ""}`}>
        <div className="dropdown-section">
          <Link
            href="/user-profile"
            className="dropdown-item"
            onClick={() => setIsMenuOpen(false)}
          >
            <User className="dropdown-icon" />
            <span>Профиль</span>
          </Link>

          <Link
            href="/user-dashboard"
            className="dropdown-item"
            onClick={() => setIsMenuOpen(false)}
          >
            <LayoutDashboard className="dropdown-icon" />
            <span>Панель управления</span>
          </Link>

          <Link
            href="/"
            className="dropdown-item"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className="dropdown-icon" />
            <span>Главная</span>
          </Link>
        </div>

        {isManagerOrAdmin() && (
          <div className="dropdown-section">
            <div className="dropdown-section-label">Управление</div>
            <Link
              href={isAdmin() ? "/admin-dashboard" : "/manager-dashboard"}
              className="dropdown-item"
              onClick={() => setIsMenuOpen(false)}
            >
              <Shield className="dropdown-icon" />
              <span>{isAdmin() ? "Админ-панель" : "Менеджер-панель"}</span>
            </Link>
            {isAdmin() && (
              <Link
                href="/administrator/settings"
                className="dropdown-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="dropdown-icon" />
                <span>Настройки системы</span>
              </Link>
            )}
          </div>
        )}

        <div className="dropdown-section">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="dropdown-item logout"
          >
            <LogOut className="dropdown-icon" />
            <span>{isLoggingOut ? "Выход..." : "Выйти"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
