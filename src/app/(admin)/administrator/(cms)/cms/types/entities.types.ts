export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface ArticleApiResponse extends ApiResponse {
  data?: {
    name(arg0: string, name: any): unknown;
    slug(arg0: string, slug: any): unknown;
    description: string;
    keywords: any;
    image: string;
    imageAlt: string;
    categoryId(arg0: string, categoryId: any): unknown;
    categoryName(arg0: string, categoryName: any): unknown;
    categorySlug(arg0: string, categorySlug: any): unknown;
    content: string;
    status: string;
    isFeatured: boolean;
    _id: string;
  };
}