"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, FolderTree, Tags, FileText, Truck } from "lucide-react";

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

  const menuItems = [
    {
      id: "new-article",
      title: "Новая статья",
      description: "Создать статью в редакторе",
      icon: <Plus className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      shadow: "shadow-lg shadow-blue-500/20",
      path: "/administrator/cms/editor",
    },
    {
      id: "all-articles",
      title: "Все статьи",
      description: "Просмотр и управление статьями",
      icon: <FileText className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      hoverColor: "hover:from-indigo-600 hover:to-indigo-700",
      shadow: "shadow-lg shadow-indigo-500/20",
      path: "/administrator/cms/all-articles",
    },
    {
      id: "categories",
      title: "Категории",
      description: "Управление категориями блога",
      icon: <FolderTree className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      shadow: "shadow-lg shadow-green-500/20",
      path: "/administrator/cms/categories",
    },
    {
      id: "semantic-core",
      title: "Семантическое ядро",
      description: "Ключевые слова и SEO",
      icon: <Tags className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      shadow: "shadow-lg shadow-purple-500/20",
      path: "/administrator/cms/semantic-core",
    },
  ];

  const handleItemClick = (path: string) => {
    router.push(path);
    onCloseAction();
  };

  if (!mounted) return null;

  return (
    <>
      {/* Overlay с анимацией */}
      <div
        className={`fixed inset-0 bg-linear-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-sm z-40 transition-all duration-700 ease-out ${
          isOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onCloseAction}
      >
        {/* Анимированные частицы */}
        {isOpen && (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-300" />
          </>
        )}
      </div>

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
            {/* Заголовок с анимацией */}
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur opacity-70 animate-pulse" />
                  <Truck className="relative w-7 h-7 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Быстрые действия
                </h2>
              </div>
              
              <button
                onClick={onCloseAction}
                className="group p-3 rounded-2xl bg-linear-to-br from-gray-100 to-white shadow-lg hover:shadow-xl hover:from-gray-200 duration-500 cursor-pointer transition-all hover:scale-110"
                aria-label="Закрыть меню"
              >
                <X className="w-6 h-6 text-white group-hover:text-gray-300 group-hover:rotate-90 transition-all duration-500" />
              </button>
            </div>

            {/* Основные кнопки с анимациями */}
            <div className="space-y-5 flex-1">
              {menuItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.path)}
                  className={`group w-full flex items-center gap-4 p-6 rounded-2xl text-left cursor-pointer transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.99] ${item.shadow} animate-slideIn`}
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  {/* Иконка с анимацией */}
                  <div className={`relative p-4 rounded-xl bg-white/90 backdrop-blur-sm group-hover:bg-white transition-all duration-500 ${item.shadow}`}>
                    <div className="absolute inset-0 bg-linear-to-br from-white to-gray-100 rounded-xl opacity-50" />
                    <div className="relative">
                      <div className={`absolute inset-0 bg-linear-to-br ${item.color} rounded-lg opacity-0 group-hover:opacity-20 blur transition-all duration-500`} />
                      <div className="relative text-gray-700 group-hover:scale-110 transition-transform duration-500">
                        {item.icon}
                      </div>
                    </div>
                  </div>

                  {/* Текст */}
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-600 group-hover:text-gray-700 mt-1 transition-colors duration-300">
                      {item.description}
                    </div>
                  </div>

                  {/* Анимированная стрелка */}
                  <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Футер */}
            <div className="pt-8 mt-8 border-t border-gray-200/50">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-gray-50 to-white rounded-full shadow-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-600">
                    CMS Панель • v1.0
                  </span>
                </div>
              </div>
            </div>
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