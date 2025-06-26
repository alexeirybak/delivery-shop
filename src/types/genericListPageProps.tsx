import { ArticleCardProps } from "./articlesListPageProps";
import { ProductCardProps } from "./product";

type ContentItem = ProductCardProps | ArticleCardProps;

export interface GenericListPageProps {
  fetchData: () => Promise<ContentItem[]>;
  pageTitle: string;
  basePath: string;
  errorMessage: string;
  contentType?: "articles";
}
