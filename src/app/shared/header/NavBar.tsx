import { useState } from "react";
import Link from "next/link";
import Profile from "./Profile";
import { useAuthStore } from "@/store/authStore";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const { user } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="header-nav-menu-block">
      <div className="nav-links">
        <Link href="/pricing">Тарифы</Link>
        {user && (
          <>
            <Link href="/user-profile">Профиль</Link>
            <Link href="/user-dashboard">Панель управления</Link>
          </>
        )}
      </div>
      
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <button
              className="mobile-menu-close"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={24} />
            </button>
            <div className="mobile-menu-content">
              <Link
                href="/pricing"
                className="mobile-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Тарифы
              </Link>
              {user && (
                <>
                  <Link
                    href="/user-profile"
                    className="mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Профиль
                  </Link>
                  <Link
                    href="/user-dashboard"
                    className="mobile-link"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Панель управления
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="menu-container">
        <div className="mobile-nav">
          <button
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
        <Profile />
      </div>
    </div>
  );
};

export default NavBar;