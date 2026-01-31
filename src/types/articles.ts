export interface ArticleCardProps {
  _id: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  image?: string;
  imageAlt?: string;
  name: string;
  description?: string;
  publishedAt: string;
}
