import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { useEffect } from "react";
import { ApiResponse } from "../../../types/entities.types";
import { UpdateArticleData } from "../types";

export const useArticlesManagement = () => {
  const { loadArticles, currentPage } = useArticlesManagementStore();
  
  useEffect(() => {
    loadArticles({ page: currentPage });
  }, [currentPage, loadArticles]);

  const updateArticle = async (
    id: string,
    articleData: UpdateArticleData,
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        `/administrator/cms/api/articles/articles-management/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(articleData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        await loadArticles({ page: currentPage });
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
            : "Ошибка сети при обновлении статьи",
      };
    }
  };

  const reorderArticles = async (
    articles: Array<{
      _id: string;
      numericId: number;
    }>,
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        "/administrator/cms/api/articles/articles-management/reorder1",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(articles),
        },
      );

      const data = await response.json();

      if (response.ok) {
        // Обновляем данные с сервера
        await loadArticles();
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

  return { updateArticle, loadArticles, reorderArticles };
};