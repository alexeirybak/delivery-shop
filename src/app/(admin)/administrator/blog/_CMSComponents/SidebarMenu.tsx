"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, FolderTree, Tags, Edit, Layers, FileText } from "lucide-react";

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

  const handleNewArticle = () => {
    router.push("/administrator/blog/editor");
    onCloseAction();
  };

  const handleCategoriesPage = () => {
    router.push("/administrator/blog/categories");
    onCloseAction();
  };

  const handleSemanticCorePage = () => {
    router.push("/administrator/blog/semantic-core");
    onCloseAction();
  };

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onCloseAction}
      />

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Заголовок и кнопка закрытия */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900">
              Быстрые действия
            </h2>
            <button
              onClick={onCloseAction}
              className="p-2 hover:bg-gray-100 rounded-full duration-300 cursor-pointer"
              aria-label="Закрыть меню"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Основные кнопки */}
          <div className="space-y-4 flex-1">
            {/* Кнопка "Новая статья" */}
            <button
              onClick={handleNewArticle}
              className="w-full flex items-center gap-3 p-4 bg-blue-600 text-white rounded hover:bg-blue-700 text-left duration-300 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <div>
                <div className="font-semibold">Новая статья</div>
                <div className="text-sm opacity-90">
                  Создать новую статью в редакторе
                </div>
              </div>
            </button>

            {/* Кнопка "Управление категориями" */}
            <button
              onClick={handleCategoriesPage}
              className="w-full flex items-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 text-left duration-300 cursor-pointer"
            >
              <FolderTree className="w-5 h-5" />
              <div>
                <div className="font-semibold">Управление категориями</div>
                <div className="text-sm opacity-90">
                  Редактировать все категории
                </div>
              </div>
            </button>

            {/* Кнопка "Семантическое ядро" */}
            <button
              onClick={handleSemanticCorePage}
              className="w-full flex items-center gap-3 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-left duration-300 cursor-pointer"
            >
              <Tags className="w-5 h-5" />
              <div>
                <div className="font-semibold">Семантическое ядро</div>
                <div className="text-sm opacity-90">
                  Управление ключевыми словами
                </div>
              </div>
            </button>
          </div>

          {/* Быстрые ссылки */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <nav className="space-y-2">
              <button
                onClick={handleNewArticle}
                className="w-full flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded text-left duration-300 cursor-pointer"
              >
                <Edit className="w-4 h-4" />
                Редактор статей
              </button>

              <button
                onClick={handleCategoriesPage}
                className="w-full flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded text-left duration-300 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                Все категории
              </button>

              <button
                onClick={handleSemanticCorePage}
                className="w-full flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded text-left duration-300 cursor-pointer"
              >
                <Tags className="w-4 h-4" />
                Семантическое ядро
              </button>

              <button
                onClick={() => {
                  router.push("/administrator/blog");
                  onCloseAction();
                }}
                className="w-full flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded text-left duration-300 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                Все статьи
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}