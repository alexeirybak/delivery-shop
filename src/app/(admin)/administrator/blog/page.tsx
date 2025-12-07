"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Edit2, Eye, Trash2, ChevronDown } from "lucide-react";
import MiniLoader from "@/components/MiniLoader";

interface Article {
  _id: string;
  title: string;
  slug: string;
  authorName: string;
  category: string;
  status: "published" | "draft" | "archived" | "deleted";
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
}

interface FilterState {
  search: string;
  category: string;
  status: string;
  sortBy: "createdAt" | "updatedAt" | "title" | "views";
  sortOrder: "asc" | "desc";
  page: number;
}

// Кастомный компонент выпадающего списка
interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  className?: string;
}

function Dropdown({ value, onChange, options, placeholder, className = "" }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value) || { value: "", label: placeholder || "Выберите..." };

  // Закрытие по клику вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer outline-none flex justify-between items-center bg-white hover:border-gray-400 transition-colors"
      >
        <span className="text-gray-700">{selectedOption.label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                value === option.value ? "bg-primary/5 text-primary font-medium" : "text-gray-700"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Компактный выпадающий список для таблицы
function TableDropdown({ value, onChange, options }: Omit<DropdownProps, 'placeholder' | 'className'>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm border border-gray-300 rounded px-3 py-1 cursor-pointer outline-none flex items-center justify-between min-w-[120px] bg-white hover:border-gray-400 transition-colors"
      >
        <span className={`font-medium ${value === 'published' ? 'text-green-600' : value === 'draft' ? 'text-yellow-600' : 'text-gray-600'}`}>
          {selectedOption?.label}
        </span>
        <ChevronDown className={`w-3 h-3 ml-2 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors ${
                value === option.value ? "bg-primary/5 text-primary font-medium" : "text-gray-700"
              } ${
                option.value === 'published' ? 'hover:text-green-600' : 
                option.value === 'draft' ? 'hover:text-yellow-600' : 
                'hover:text-gray-600'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CMSPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    status: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
  });

  const itemsPerPage = 10;

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/posts/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "getArticles",
          page: filters.page,
          limit: itemsPerPage,
          search: filters.search === "" ? undefined : filters.search,
          category: filters.category === "all" ? undefined : filters.category,
          status: filters.status === "all" ? undefined : filters.status,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setArticles(data.data);
        setTotalPages(data.pagination.totalPages);
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Ошибка загрузки статей:", error);
    } finally {
      setLoading(false);
    }
  }, [
    filters.category,
    filters.page,
    filters.search,
    filters.sortBy,
    filters.sortOrder,
    filters.status,
  ]);

  useEffect(() => {
    loadArticles();
  }, [
    filters.page,
    filters.category,
    filters.status,
    filters.sortBy,
    filters.sortOrder,
    loadArticles,
  ]);

  // Дебаунс для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.page !== 1) {
        setFilters((prev) => ({ ...prev, page: 1 }));
      } else {
        loadArticles();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [filters.page, filters.search, loadArticles]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Удалить статью "${title}"?`)) return;

    try {
      const response = await fetch("/api/posts/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          id: id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        loadArticles();
        alert("Статья удалена");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка удаления статьи");
    }
  };

  // Изменение статуса
  const handleStatusArticleChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch("/api/posts/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "changeStatus",
          id: id,
          newStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        loadArticles();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка изменения статуса:", error);
      alert("Ошибка изменения статуса");
    }
  };

  // Сброс фильтров
  const resetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      status: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
    });
  };

  // Обработчики изменения фильтров
  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const handleStatusChangeFilter = (value: string) => {
    setFilters((prev) => ({ ...prev, status: value }));
  };

  const handleSortByChange = (
    value: "createdAt" | "updatedAt" | "title" | "views"
  ) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleSortOrderToggle = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "desc" ? "asc" : "desc",
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Подготовка опций для выпадающих списков
  const categoryOptions = [
    { value: "all", label: "Все категории" },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];

  const statusOptions = [
    { value: "all", label: "Все статусы" },
    { value: "published", label: "Опубликовано" },
    { value: "draft", label: "Черновик" },
    { value: "archived", label: "В архиве" },
  ];

  const sortByOptions = [
    { value: "createdAt", label: "По дате создания" },
    { value: "updatedAt", label: "По дате обновления" },
    { value: "title", label: "По названию" },
    { value: "views", label: "По просмотрам" },
  ];

  const articleStatusOptions = [
    { value: "published", label: "Опубликовано" },
    { value: "draft", label: "Черновик" },
    { value: "archived", label: "Архив" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок и кнопки */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Управление статьями
            </h1>
            <p className="text-gray-600 mt-2">
              Всего статей: {articles.length}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition-colors"
            >
              Сбросить фильтры
            </button>
            <Link
              href="/administrator/editor"
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 cursor-pointer transition-colors"
            >
              + Новая статья
            </Link>
            <Link
              href="/administrator/editor"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer transition-colors"
            >
              Редактор
            </Link>
          </div>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Поиск */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Поиск по названию
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Название статьи..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer outline-none hover:border-gray-400 transition-colors"
              />
            </div>

            {/* Категория */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория
              </label>
              <Dropdown
                value={filters.category}
                onChange={handleCategoryChange}
                options={categoryOptions}
                placeholder="Все категории"
              />
            </div>

            {/* Статус */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус
              </label>
              <Dropdown
                value={filters.status}
                onChange={handleStatusChangeFilter}
                options={statusOptions}
                placeholder="Все статусы"
              />
            </div>

            {/* Сортировка */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сортировка
              </label>
              <div className="flex gap-2">
                <Dropdown
                  value={filters.sortBy}
                  onChange={handleSortByChange}
                  options={sortByOptions}
                  placeholder="Выберите сортировку"
                  className="flex-1"
                />
                <button
                  onClick={handleSortOrderToggle}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 cursor-pointer transition-colors min-w-[60px]"
                >
                  {filters.sortOrder === "desc" ? "↓" : "↑"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Таблица статей */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <MiniLoader />
          ) : articles.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Статьи не найдены</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {article.authorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TableDropdown
                          value={article.status}
                          onChange={(value) => handleStatusArticleChange(article._id, value)}
                          options={articleStatusOptions}
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
                            onClick={() => handleDelete(article._id, article.title)}
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
          )}

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Страница <span className="font-medium">{filters.page}</span>{" "}
                  из <span className="font-medium">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                    disabled={filters.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    Назад
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (filters.page <= 3) {
                      pageNum = i + 1;
                    } else if (filters.page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = filters.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 border rounded cursor-pointer transition-colors ${
                          filters.page === pageNum
                            ? "bg-primary text-white border-primary hover:bg-primary"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
                    disabled={filters.page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    Вперед
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}