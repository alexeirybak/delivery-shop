import { Article } from "./articles.types";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
}

export interface CategoryImageProps {
  category: Category;
  gradientColor: string;
  hasImage: boolean;
}

export interface CategoryHeaderProps {
  title: string;
  description?: string;
}

export interface CategoryStatsProps {
  totalArticles: number;
  currentPage: number;
  totalPages: number;
  articlesCount: number;
}

export interface CategoryPageResponse {
  category: Category;
  articles: Article[];
  totalArticles: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

export interface ApiError {
  error: string;
}
