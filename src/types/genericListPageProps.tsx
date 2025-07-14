import { ArticleCardProps } from "./articles";
import { ProductCardProps } from "./product";

type ContentItem = ProductCardProps | ArticleCardProps;

interface PaginatedResponse {
  items: ContentItem[];
  totalCount: number;
}

export interface GenericListPageProps {
  fetchData: (options: {
    pagination: { startIdx: number; perPage: number };
  }) => Promise<PaginatedResponse>;
  pageTitle?: string;
  basePath: string;
  contentType?: string;
}
