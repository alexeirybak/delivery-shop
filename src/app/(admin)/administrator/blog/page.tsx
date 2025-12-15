"use client";

import { useState, useEffect, useCallback } from "react";
import FilterPanel from "./_CMSComponents/FilterPanel";
import ArticlesTable from "./_CMSComponents/ArticlesTable";
import Pagination from "./_CMSComponents/Pagination";
import { FilterState } from "./types/filterState";

interface Article {
  _id: string;
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  authorName: string;
  keywords: string[];
  category: string;
  views: number;
  likes: number;
  // comments: [];
  status: "draft" | "published" | "archived" | "deleted";
  createdAt: string | Date;
  updatedAt: string | Date;
  publishedAt: string | Date | null;
}

export default function CMSPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: "all",
    status: "all",
    author: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    itemsPerPage: 10,
  });

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      // Создаем параметры запроса
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.itemsPerPage.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.search && filters.search.trim() !== "") {
        params.append("search", filters.search.trim());
      }
      if (filters.category !== "all") {
        params.append("category", filters.category);
      }
      if (filters.status !== "all") {
        params.append("status", filters.status);
      }
      if (filters.author !== "all") {
        params.append("author", filters.author);
      }

      // Загружаем статьи
      const articlesResponse = await fetch(
        `/administrator/blog/api/posts/articles?${params}`
      );
      const articlesData = await articlesResponse.json();

      if (articlesData.success) {
        setArticles(articlesData.data);
        setTotalPages(articlesData.pagination.totalPages);
        setTotalArticles(articlesData.pagination.totalArticles);
      }

      // Загружаем фильтры
      const filtersResponse = await fetch(
        `/administrator/blog/api/posts/filters?${params}`
      );
      const filtersData = await filtersResponse.json();

      if (filtersData.success) {
        setCategories(filtersData.categories || []);
        setAuthors(filtersData.authors || []);
      }
    } catch (error) {
      console.error("Ошибка загрузки:", error);
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
    filters.author,
    filters.itemsPerPage,
  ]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.page !== 1) {
        setFilters((prev) => ({ ...prev, page: 1 }));
      } else {
        loadArticles();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [filters.search, filters.author, loadArticles, filters.page]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (newStatus === "deleted") {
      if (!confirm("Вы уверены, что хотите удалить эту статью?")) {
        return;
      }
    }

    try {
      const response = await fetch("/administrator/blog/api/posts/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: id,
          data: { status: newStatus },
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (newStatus === "deleted") {
          alert("Статья удалена!");
        }
        loadArticles();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка изменения статуса:", error);
      alert("Ошибка изменения статуса");
    }
  };

  const handleCategoryChange = async (id: string, newCategory: string) => {
    try {
      const response = await fetch("/administrator/blog/api/posts/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update",
          id: id,
          data: { category: newCategory },
        }),
      });

      const data = await response.json();

      if (data.success) {
        loadArticles();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Ошибка изменения категории:", error);
      alert("Ошибка изменения категории");
    }
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      status: "all",
      author: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      itemsPerPage: 10,
    });
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

  const categoryOptions = [
    { value: "all", label: "Все категории" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  const authorOptions = [
    { value: "all", label: "Все авторы" },
    ...authors.map((author) => ({ value: author, label: author })),
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
            <p className="text-gray-600 mt-2">Всего статей: {totalArticles}</p>
          </div>
        </div>

        {/* Фильтры */}
        <FilterPanel
          filters={filters}
          categoryOptions={categoryOptions}
          authorOptions={authorOptions}
          onFilterChangeAction={handleFilterChange}
          onResetFiltersAction={resetFilters}
          onSortOrderToggleAction={handleSortOrderToggle}
        />

        {/* Таблица статей */}
        <div className="bg-white rounded shadow-sm">
          <ArticlesTable
            articles={articles}
            categories={categories}
            loading={loading}
            onStatusChangeAction={handleStatusChange}
            onCategoryChangeAction={handleCategoryChange}
          />

          {/* Пагинация */}
          {totalPages > 1 && (
            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              totalItems={totalArticles}
              itemsPerPage={filters.itemsPerPage}
              onPageChangeAction={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
