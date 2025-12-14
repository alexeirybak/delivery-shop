"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, FolderTree, Tags, FileText, BarChart3, Folder, Search } from "lucide-react";

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  path: string;
  actionText: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dashboardCards: DashboardCard[] = [
    {
      id: "new-article",
      title: "Новая статья",
      description: "Создать статью в редакторе",
      icon: <Plus className="w-6 h-6" />,
      color: "blue",
      path: "/administrator/blog/editor",
      actionText: "Создать",
    },
    {
      id: "all-articles",
      title: "Все статьи",
      description: "Просмотр и управление статьями",
      icon: <FileText className="w-6 h-6" />,
      color: "indigo",
      path: "/administrator/blog",
      actionText: "Перейти",
    },
    {
      id: "categories",
      title: "Категории",
      description: "Управление категориями блога",
      icon: <FolderTree className="w-6 h-6" />,
      color: "green",
      path: "/administrator/blog/categories",
      actionText: "Управлять",
    },
    {
      id: "semantic-core",
      title: "Семантическое ядро",
      description: "Ключевые слова и SEO",
      icon: <Tags className="w-6 h-6" />,
      color: "purple",
      path: "/administrator/blog/semantic-core",
      actionText: "Настроить",
    },
  ];

  const stats = [
    { title: "Опубликовано", value: "0", color: "blue", icon: <FileText className="w-5 h-5" /> },
    { title: "Категорий", value: "0", color: "green", icon: <Folder className="w-5 h-5" /> },
    { title: "Ключевых слов", value: "0", color: "purple", icon: <Search className="w-5 h-5" /> },
    { title: "Просмотров", value: "0", color: "orange", icon: <BarChart3 className="w-5 h-5" /> },
  ];

  const navigateTo = (path: string) => {
    router.push(path);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Административная панель
          </h1>
          <p className="text-gray-600 mt-2">
            Управление контентом и SEO блога
          </p>
        </div>

        {/* Карточки действий */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              onClick={() => navigateTo(card.path)}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 p-6 group"
            >
              <div className="flex flex-col h-full">
                <div className={`p-3 ${getBgColor(card.color)} rounded-lg w-fit mb-4 group-hover:scale-105 transition-transform duration-300`}>
                  <div className={getTextColor(card.color)}>
                    {card.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 grow">
                  {card.description}
                </p>
                <button 
                  className={`w-full py-2 ${getButtonColor(card.color)} text-white rounded-lg hover:opacity-90 transition-opacity duration-300 cursor-pointer mt-auto`}
                >
                  {card.actionText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Статистика */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Общая статистика
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 ${getBgColor(stat.color)} rounded-lg`}>
                    <div className={getTextColor(stat.color)}>
                      {stat.icon}
                    </div>
                  </div>
                  <span className={`text-2xl font-bold ${getTextColor(stat.color)}`}>
                    {stat.value}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900">{stat.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Вспомогательные функции для цветов
function getBgColor(color: string): string {
  const colors: Record<string, string> = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    indigo: "bg-indigo-100",
    orange: "bg-orange-100",
  };
  return colors[color] || "bg-gray-100";
}

function getTextColor(color: string): string {
  const colors: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
    orange: "text-orange-600",
  };
  return colors[color] || "text-gray-600";
}

function getButtonColor(color: string): string {
  const colors: Record<string, string> = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    indigo: "bg-indigo-600",
    orange: "bg-orange-600",
  };
  return colors[color] || "bg-gray-600";
}