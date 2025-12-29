import { useState, useCallback, useEffect } from "react";
import {
  CategoryFormData,
  ApiResponse,
  FilterType,
  SortField,
  UpdateCategoryData,
} from "../types";
import { useCategoryStore } from "@/store/categoryStore";
import { CONFIG_BLOG } from "../CONFIG_BLOG";

export const useCategories = () => {
  // Получаем только методы для обновления store
  const { setCategories, setTotalPages, setTotalItems, setTotalAllItems } =
    useCategoryStore();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(CONFIG_BLOG.ITEMS_PER_PAGE);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortField, setSortField] = useState<SortField>("numericId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

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
        queryParams.append(
          "page",
          (params?.page !== undefined ? params.page : currentPage).toString()
        );
        queryParams.append("limit", itemsPerPage.toString());

        const search =
          params?.search !== undefined ? params.search : searchQuery;
        const filterBy =
          params?.filterBy !== undefined ? params.filterBy : filterType;
        const sortBy = params?.sortBy !== undefined ? params.sortBy : sortField;
        const sortOrder =
          params?.sortOrder !== undefined ? params.sortOrder : sortDirection;

        if (search) queryParams.append("search", search);
        if (filterBy) queryParams.append("filterBy", filterBy);
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (sortOrder) queryParams.append("sortOrder", sortOrder);

        const response = await fetch(
          `/administrator/cms/api/categories?${queryParams.toString()}`
        );
        const data = await response.json();

        if (data.success) {
          // ТОЛЬКО обновляем store
          setCategories(data.data.categories);
          setTotalPages(data.data.pagination.totalPages);
          setTotalItems(data.data.pagination.total);
          setTotalAllItems(data.data.totalInDB);

          if (params?.page !== undefined) setCurrentPage(params.page);
          if (params?.search !== undefined) setSearchQuery(params.search);
        }
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      } finally {
        setLoading(false);
      }
    },
    [
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
    // ТОЛЬКО состояние UI и методы
    loading,
    currentPage,
    itemsPerPage,
    filterType,
    sortField,
    sortDirection,
    // totalPages, totalItems, totalAllItems - НЕ возвращаем, они в store

    // Методы
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