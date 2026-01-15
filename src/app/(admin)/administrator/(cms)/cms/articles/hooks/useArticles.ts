import { ApiResponse } from "../../categories/types";
import { ArticleFormData } from "../types";

export const useArticles = () => {

  const createArticle = async (
    articleData: Omit<ArticleFormData, "keywords">
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch("/administrator/cms/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
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
