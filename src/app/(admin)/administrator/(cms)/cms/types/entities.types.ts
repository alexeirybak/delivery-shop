export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface ArticleApiResponse extends ApiResponse {
  data?: {
    _id: string;
  };
}