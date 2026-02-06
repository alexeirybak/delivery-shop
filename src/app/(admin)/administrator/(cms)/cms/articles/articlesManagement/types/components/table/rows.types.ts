import { Article } from "../..";

export interface MobileArticleHeaderProps {
  article: Article;
  displayNumericId: number | null;
}

export interface SortableItemProps {
  article: Article;
  displayNumericId: number | null;
  isDragging?: boolean;
  id?: string;
}

export interface MobileExpandableContentProps {
  article: Article;
}
