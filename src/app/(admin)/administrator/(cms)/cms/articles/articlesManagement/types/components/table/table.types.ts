import { Article } from "../../models";

export interface ArticleTableProps {
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedArticles: Article[]) => void;
}

export type SortField =
  | "numericId"
  | "name"
  | "categoryName"
  | "slug"
  | "isFeatured"
  | "status"
  | "author"
  | "createdAt"
  | "views";
export type SortDirection = "asc" | "desc";

export type FilterType =
  | "all"
  | "name"
  | "slug"
  | "content"
  | "description"
  | "keywords"
  | "author"
  | "category";
