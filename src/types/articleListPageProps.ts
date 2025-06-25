import { Article } from "./articles";

export interface ArticleListPageProps {
  fetchData: () => Promise<Article[]>;
  pageTitle: string;
  basePath: string;
  errorMessage: string;
}
