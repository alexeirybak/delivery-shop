import { ArticleApiResponse } from "../../types/entities.types";
import { ArticleFormData } from "../types";

export const useArticles = () => {
  const createArticle = async (
    articleData: Omit<ArticleFormData, "keywords"> 
  ): Promise<ArticleApiResponse> => {
    try {
      const response = await fetch("/administrator/cms/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });

      const responseData = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: responseData.message || "Статья успешно создана",
          data: responseData.data
        };
      } else {
        console.error("Ошибка от сервера:", responseData);
        return {
          success: false,
          message:
            responseData.message || `Ошибка ${response.status}: ${response.statusText}`,
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
