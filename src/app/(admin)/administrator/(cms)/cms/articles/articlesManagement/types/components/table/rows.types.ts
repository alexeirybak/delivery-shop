import { Article } from "../..";

export interface MobileArticleHeaderProps {
  article: Article;
  displayNumericId: number | null;
}

export type ArticleStatus = "published" | "draft" | "archived" | "deleted";

export interface SortableItemProps {
  article: Article;
  displayNumericId: number | null;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  id?: string;
}

export interface MobileExpandableContentProps {
  article: Article;
  onDelete: (id: string) => void;
}
