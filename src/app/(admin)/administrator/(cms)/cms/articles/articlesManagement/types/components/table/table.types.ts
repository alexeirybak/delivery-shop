import { Article } from "../..";

export interface ArticleTableProps {
  onReorder?: (reorderedCategories: Article[]) => void;
}

export type SortField =
  | "numericId"
  | "name"
  | "slug"
  | "categoryName"
  | "slug"
  | "isFeatured"
  | "status"
  | "createdAt"
  | "author"
  | "views";

export type SortDirection = "asc" | "desc";

export type FilterType =
  | "all"
  | "name"
  | "slug"
  | "content"
  | "description"
  | "category"
  | "keywords"
  | "author";
