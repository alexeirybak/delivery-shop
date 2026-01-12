import { useCategoryStore } from "@/store/categoryStore";
import { ApiResponse, CategoryFormData } from "../../categories/types";

export const useArticles = () => {
  const { } = useCategoryStore();

  const createArticle = async (
    categoryData: Omit<CategoryFormData, "keywords">
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch("/administrator/cms/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Статья успешно создана",
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
            : "Ошибка сети при создании статьи",
      };
    }
  };

  return {
    createArticle,
  };
};
