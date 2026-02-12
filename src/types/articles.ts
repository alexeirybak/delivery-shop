export interface ArticleCardProps {
  slug: string;
  categorySlug: string;
  categoryName: string;
  image?: string;
  imageAlt?: string;
  name: string;
  description?: string;
  publishedAt: string;
}

// http://localhost:3000/administrator/cms/api/articles/yandex-image