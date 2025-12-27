import { useState, useCallback, useEffect } from "react";
import {
  Category,
  CategoryFormData,
  ApiResponse,
  FilterType,
  SortField,
  UpdateCategoryData,
} from "../types";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortField, setSortField] = useState<SortField>("numericId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const loadCategories = useCallback(
    async (params?: {
      page?: number;
      search?: string;
      filterBy?: FilterType;
      sortBy?: SortField;
      sortOrder?: "asc" | "desc";
    }) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("page", (params?.page || currentPage).toString());
        queryParams.append("limit", itemsPerPage.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.filterBy) queryParams.append("filterBy", params.filterBy);
        if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
        if (params?.sortOrder)
          queryParams.append("sortOrder", params.sortOrder);

        const response = await fetch(
          `/administrator/cms/api/categories?${queryParams.toString()}`
        );
        const data = await response.json();

        if (data.success) {
          setCategories(data.data.categories);
          setTotalPages(data.data.pagination.totalPages);
          setTotalItems(data.data.pagination.total);
          if (params?.page) setCurrentPage(params.page);
        }
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, itemsPerPage]
  );

  const createCategory = async (
    categoryData: Omit<CategoryFormData, "keywords"> & {
      keywords: string[];
      numericId: number | null;
      author: string;
    }
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch("/administrator/cms/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (response.ok) {
        await loadCategories();
        return {
          success: true,
          message: data.message || "Категория успешно создана",
        };
      } else {
        console.error("Ошибка от сервера:", data);
        return {
          success: false,
          message:
            data.message || `Ошибка ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      console.error("🌐 [useCategories] Ошибка сети:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ошибка сети при создании категории",
      };
    }
  };

  const updateCategory = async (
    id: string,
    categoryData: UpdateCategoryData
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(`/administrator/cms/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (response.ok) {
        await loadCategories();
        return {
          success: true,
          message: data.message,
        };
      } else {
        console.error("Ошибка от сервера при обновлении:", data);
        return {
          success: false,
          message:
            data.message || `Ошибка ${response.status}: ${response.statusText}`,
        };
      }
    } catch (error) {
      console.error("Ошибка сети при обновлении:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ошибка сети при обновлении категории",
      };
    }
  };

  const deleteCategory = async (id: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(`/administrator/cms/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        await loadCategories();
        return {
          success: true,
          message: data.message,
        };
      } else {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (error) {
      console.error("Ошибка удаления категории:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ошибка сети при удалении категории",
      };
    }
  };

  const reorderCategories = async (
    categories: Array<{
      _id: string;
      numericId: number;
    }>
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        "/administrator/cms/api/categories/reorder",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categories), // Отправляем массив напрямую
        }
      );

      const data = await response.json();

      if (response.ok) {
        await loadCategories();
        return {
          success: true,
          message: data.message,
        };
      } else {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (error) {
      console.error("Ошибка переупорядочивания:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ошибка сети при переупорядочивании",
      };
    }
  };

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    filterType,
    sortField,
    sortDirection,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    setCurrentPage,
    setItemsPerPage,
    setFilterType,
    setSortField,
    setSortDirection,
    loadCategories,
  };
};
