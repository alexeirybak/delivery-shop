export interface CategoryForSitemap {
  id: number;
  slug: string;
  title: string;
}

export interface ProductForSitemap {
  id: number;
  title: string;
  updatedAt: string;
  categorySlug: string;
}

export interface SitemapDataResponse {
  success: boolean;
  categories: CategoryForSitemap[];
  products: ProductForSitemap[];
  count: {
    categories: number;
    products: number;
  };
  generatedAt: string;
}