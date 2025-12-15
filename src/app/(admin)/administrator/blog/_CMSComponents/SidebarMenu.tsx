"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";
import MenuOverlay from "./MenuOverlay";
import MenuHeader from "./MenuHeader";
import MenuItemsList from "./MenuItemsList";
import MenuFooter from "./MenuFooter";
import { menuItems } from "../utils/menuItems";

interface SidebarMenuProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function SidebarMenu({ isOpen, onCloseAction }: SidebarMenuProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCloseAction();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onCloseAction]);

  // Блокировка скролла при открытом меню
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

 

  const handleItemClick = (path: string) => {
    router.push(path);
    onCloseAction();
  };

  if (!mounted) return null;

  return (
    <>
      <MenuOverlay isOpen={isOpen} onClose={onCloseAction} />
      
      {/* Sidebar с улучшенной анимацией */}
      <div
        className={`fixed right-0 top-0 h-full w-96 z-200 ${
          isOpen 
            ? "translate-x-0 opacity-100" 
            : "translate-x-full opacity-0"
        }`}
        style={{
          transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-out",
        }}
      >
        <div className="relative h-full w-full">
          {/* Фон сайдбара с градиентом */}
          <div className="absolute inset-0 bg-linear-to-b from-white via-white to-gray-50/95 backdrop-blur-xl" />
          
          {/* Декоративные элементы */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-purple-500/5" />
          
          {/* Контент */}
          <div className="relative h-full flex flex-col p-8">
            <MenuHeader 
              isOpen={isOpen} 
              onCloseAction={onCloseAction} 
              icon={<Truck className="relative w-7 h-7 text-blue-600" />}
            />
            
            <MenuItemsList 
              items={menuItems} 
              onItemClick={handleItemClick} 
            />
            
            <MenuFooter />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          opacity: 0;
        }
        
        /* Градиент для каждой кнопки */
        .group:nth-child(1) {
          --tw-gradient-from: #3b82f6;
          --tw-gradient-to: #1d4ed8;
        }
        .group:nth-child(2) {
          --tw-gradient-from: #6366f1;
          --tw-gradient-to: #4338ca;
        }
        .group:nth-child(3) {
          --tw-gradient-from: #10b981;
          --tw-gradient-to: #047857;
        }
        .group:nth-child(4) {
          --tw-gradient-from: #8b5cf6;
          --tw-gradient-to: #7c3aed;
        }
      `}</style>
    </>
  );
}