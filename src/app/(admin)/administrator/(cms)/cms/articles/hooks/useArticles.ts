import { ArticleApiResponse } from "../../types/entities.types";
import { ArticleFormData } from "../types";

export const useArticles = () => {
  const createArticle = async (
    articleData: Omit<ArticleFormData, "keywords">,
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
          data: responseData.data,
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

  // const updateArticle = async (
  //   articleData: Omit<ArticleFormData, "keywords"> & {
  //     keywords?: string | string[];
  //     _id?: string;
  //   }
  // ): Promise<ArticleApiResponse> => { // Используем ArticleApiResponse
  //   try {
  //     const response = await fetch("/administrator/cms/api/articles", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(articleData),
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       return {
  //         success: true,
  //         message: data.message || "Статья успешно обновлена",
  //         data: data.data,
  //       };
  //     } else {
  //       console.error("Ошибка от сервера:", data);
  //       return {
  //         success: false,
  //         message:
  //           data.message || `Ошибка ${response.status}: ${response.statusText}`,
  //         field: data.field, // Добавляем поле ошибки
  //       };
  //     }
  //   } catch (error) {
  //     console.error("Ошибка сети:", error);
  //     return {
  //       success: false,
  //       message:
  //         error instanceof Error
  //           ? error.message
  //           : "Ошибка сети при обновлении статьи",
  //     };
  //   }
  // };

  // const fetchArticleForEdit = async (articleId: string): Promise<ArticleFormData | null> => {
  //   try {
  //     const response = await fetch(`/administrator/cms/api/articles/${articleId}`);

  //     if (!response.ok) return null;

  //     const data = await response.json();
  //     return data.data;
  //   } catch (error) {
  //     console.error("Ошибка загрузки статьи:", error);
  //     return null;
  //   }
  // };

  return {
    createArticle,
    // updateArticle,
    // fetchArticleForEdit,
  };
};
