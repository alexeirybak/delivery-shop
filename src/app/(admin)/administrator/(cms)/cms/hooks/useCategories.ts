import { useCallback, useEffect } from "react";
import {
  CategoryFormData,
  ApiResponse,
  FilterType,
  SortField,
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
    filterType,
    sortField,
    sortDirection,
    searchQuery,
    setFilterType,
    setSortField,
    setSortDirection,
    setSearchQuery,
  } = useCategoryStore();

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

        // 1. Определяем значения для запроса
        const pageToLoad = params?.page ?? currentPage;
        const effectiveSearch = params?.search ?? searchQuery;
        const effectiveFilterBy = params?.filterBy ?? filterType;
        const effectiveSortBy = params?.sortBy ?? sortField;
        const effectiveSortOrder = params?.sortOrder ?? sortDirection;

        // 2. Обновляем store, если переданы новые параметры
        if (params?.search !== undefined) setSearchQuery(params.search);
        if (params?.filterBy !== undefined) setFilterType(params.filterBy);
        if (params?.sortBy !== undefined) setSortField(params.sortBy);
        if (params?.sortOrder !== undefined) setSortDirection(params.sortOrder);
        if (params?.page !== undefined && params.page !== currentPage) {
          setCurrentPage(params.page);
        }

        // 3. Добавляем параметры в URL (ТОЛЬКО ОДИН РАЗ!)
        queryParams.append("page", pageToLoad.toString());
        queryParams.append("limit", itemsPerPage.toString());

        if (effectiveSearch) queryParams.append("search", effectiveSearch);
        if (effectiveFilterBy)
          queryParams.append("filterBy", effectiveFilterBy);
        if (effectiveSortBy) queryParams.append("sortBy", effectiveSortBy);
        if (effectiveSortOrder)
          queryParams.append("sortOrder", effectiveSortOrder);

        // 4. Выполняем запрос
        const response = await fetch(
          `/administrator/cms/api/categories?${queryParams.toString()}`
        );
        const data = await response.json();

        if (data.success) {
          setCategories(data.data.categories);
          setTotalPages(data.data.pagination.totalPages);
          setTotalItems(data.data.pagination.total);
          setTotalAllItems(data.data.totalInDB);
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
      sortField,
      sortDirection,
      setCategories,
      setTotalPages,
      setTotalItems,
      setTotalAllItems,
      setCurrentPage,
      setSearchQuery,
      setFilterType,
      setSortField,
      setSortDirection,
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
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    setFilterType,
    setSortField,
    setSortDirection,
    loadCategories,
  };
};
