import { useCategoryStore } from "@/store/categoryStore";
import { useCallback, useEffect } from "react";
import { ApiResponse, CategoryFormData, UpdateCategoryData } from "../types";

export const useCategories = () => {
  const {
    setCategories,
    setTotalAllItems,
    editingId,
    setLoading,
    setTotalPages,
    setTotalItems,
    setCurrentPage,
    itemsPerPage,
    currentPage,
  } = useCategoryStore();
  const id = editingId;

  const loadCategories = useCallback(
    async (params?: { page?: number }) => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        const pageToLoad =
          params?.page !== undefined ? params.page : currentPage;
        queryParams.append("pageToLoad", pageToLoad.toString());
        queryParams.append("limit", itemsPerPage.toString());
        const response = await fetch(
          `/administrator/cms/api/categories?${queryParams}`
        );
        const data = await response.json();

        if (data.success) {
          setCategories(data.data.categories);
          setTotalAllItems(data.data.totalInDB);
          setTotalItems(data.data.pagination.total);
          setTotalPages(data.data.pagination.totalPages);

          if (params?.page !== undefined && params?.page !== currentPage) {
            setCurrentPage(params.page);
          }
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
      setCategories,
      setCurrentPage,
      setLoading,
      setTotalAllItems,
      setTotalItems,
      setTotalPages,
    ]
  );

  const createCategory = async (
    categoryData: Omit<CategoryFormData, "keywords">
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
      console.error("Ошибка сети:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Ошибка сети при создании категории",
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

  const updateCategory = async (
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

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    createCategory,
    deleteCategory,
    updateCategory,
    loadCategories,
  };
};
