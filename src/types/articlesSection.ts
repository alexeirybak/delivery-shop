import { Article } from "./articlesListPageProps";

export interface ArticlesSectionProps {
  title: string;
  viewAllButton: {
    text: string;
    href: string;
  };
  articles: Article[];
  compact?: boolean;
}
