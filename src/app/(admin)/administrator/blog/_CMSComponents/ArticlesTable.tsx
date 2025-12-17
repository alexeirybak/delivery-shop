"use client";

import Link from "next/link";
import { Edit2, Eye, Trash2 } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";
import StatusDropdown from "./StatusDropdown";
import MiniLoader from "@/components/MiniLoader";
import { Article } from "../page";

interface ArticlesTableProps {
  articles: Article[];
  categories: string[];
  loading: boolean;
  onStatusChangeAction: (id: string, status: string) => void;
  onCategoryChangeAction: (id: string, category: string) => void;
}

export default function ArticlesTable({
  articles,
  categories,
  loading,
  onStatusChangeAction,
  onCategoryChangeAction,
}: ArticlesTableProps) {
  if (loading) {
    <MiniLoader />;
  }

  if (articles.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">Статьи не найдены</p>
      </div>
    );
  }

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Категория
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Автор
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Дата создания
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Просмотры
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {articles.map((article) => (
            <tr key={article._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {article.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      /blog/{article.slug}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <CategoryDropdown
                  value={article.category}
                  onChangeAction={(newCategory) =>
                    onCategoryChangeAction(article._id, newCategory)
                  }
                  categories={categories}
                  compact={true}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {article.authorName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusDropdown
                  value={article.status}
                  onChangeAction={(value) =>
                    onStatusChangeAction(article._id, value)
                  }
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(article.createdAt).toLocaleDateString("ru-RU")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {article.views}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/${article.slug}`}
                    target="_blank"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                    title="Просмотр"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/administrator/edit/${article._id}`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded cursor-pointer transition-colors"
                    title="Редактировать"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => onStatusChangeAction(article._id, "deleted")}
                    className="p-2 text-red-600 hover:bg-red-50 rounded cursor-pointer transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
