import { Article } from "./articles.types";

export interface SearchArticle extends Article {
  category: {
    slug: string;
    name: string;
  };
  categorySlug: string;
  categoryName: string;
}

export interface SearchResult {
  articles: SearchArticle[] | null;
  searchTerm?: string;
}