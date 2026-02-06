import { useArticlesManagementStore } from "@/store/articlesManagementStore";
import { ApiResponse } from "../../types";

export const useArticlesReorder = () => {
  const { loadArticles } = useArticlesManagementStore();

  const reorderArticles = async (
    articles: Array<{
      _id: string;
      numericId: number;
    }>,
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        "/administrator/cms/api/articles/articles-management/reorder",
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
  return { loadArticles, reorderArticles };
};
