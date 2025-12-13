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
