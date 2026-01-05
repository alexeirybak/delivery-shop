import { useState, useCallback, useEffect } from "react";
import {
  CategoryFormData,
  ApiResponse,
  FilterType,
  UpdateCategoryData,
} from "../types";
import { useCategoryStore } from "@/store/categoryStore";

export const useCategories = () => {
  const {
    setCategories,
    setTotalPages,
    setTotalItems,
    setTotalAllItems,
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setLoading,
    sortField,
    sortDirection,
  } = useCategoryStore();

  const [filterType, setFilterType] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadCategories = useCallback(
    async (params?: {
      page?: number;
      search?: string;
      filterBy?: FilterType; // ОСТАВЛЯЕМ
    }) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const pageToLoad = params?.page ?? currentPage;
        queryParams.append("page", pageToLoad.toString());
        queryParams.append("limit", itemsPerPage.toString());

        const search = params?.search ?? searchQuery;
        const filterBy = params?.filterBy ?? filterType;

        // Фильтрация (БЕЗ ИЗМЕНЕНИЙ)
        if (search) queryParams.append("search", search);
        if (filterBy) queryParams.append("filterBy", filterBy);

        // Сортировка из store (ДОБАВЛЯЕМ)
        queryParams.append("sortBy", sortField);
        queryParams.append("sortOrder", sortDirection);

        const response = await fetch(
          `/administrator/cms/api/categories?${queryParams.toString()}`
        );
        const data = await response.json();

        if (data.success) {
          setCategories(data.data.categories);
          setTotalPages(data.data.pagination.totalPages);
          setTotalItems(data.data.pagination.total);
          setTotalAllItems(data.data.totalInDB);

          if (params?.page !== undefined && params.page !== currentPage) {
            setCurrentPage(params.page);
          }
          if (params?.search !== undefined) setSearchQuery(params.search);
        }
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      setLoading,
      currentPage,
      itemsPerPage,
      searchQuery,
      filterType,
      sortField, // из store
      sortDirection, // из store
      setCategories,
      setTotalPages,
      setTotalItems,
      setTotalAllItems,
      setCurrentPage,
    ]
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
          body: JSON.stringify(categories),
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
    filterType,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    setFilterType,
    loadCategories,
  };
};
