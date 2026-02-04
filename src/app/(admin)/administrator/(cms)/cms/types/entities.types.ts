import { Article } from "../articles/articlesManagement/types";

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface ArticleApiResponse extends ApiResponse {
  data?: Article;
}

export interface ArticlesApiResponse extends ApiResponse {
  data?: {
    articles: Article[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}