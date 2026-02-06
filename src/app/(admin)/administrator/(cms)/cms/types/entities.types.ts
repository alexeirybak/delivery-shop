import { Article } from "../articles/articlesManagement/types";

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface ArticleApiResponse extends ApiResponse {
  data?: Article;
}
