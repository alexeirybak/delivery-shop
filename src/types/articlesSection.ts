import { Article } from "./articles";

export interface ArticlesSectionProps {
  title: string;
  viewAllButton: {
    text: string;
    href: string;
  };
  articles: Article[];
  compact?: boolean; // Режим компонента (3/4 товара) или страницы (все товары)
}
