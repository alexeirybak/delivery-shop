export interface CategoryForSitemap {
  slug: string;
}

export interface ProductForSitemap {
  id: number;
  title: string;
  updatedAt?: string;
  categorySlug: string;
}

export interface SitemapDataResponse {
  categories: CategoryForSitemap[];
  products: ProductForSitemap[];
}

export interface ArticleCategoriesForSitemap {
  slug: string;
  updatedAt: string;
}

export interface ArticleForSitemap {
  slug: string;
  name: string;
  categorySlug: string;
  publishedAt: string;
  updatedAt: string;
}

export interface SitemapDataResponse {
  categories: CategoryForSitemap[];
  products: ProductForSitemap[];
  articleCategories: ArticleCategoriesForSitemap[];
  articles: ArticleForSitemap[];
}
