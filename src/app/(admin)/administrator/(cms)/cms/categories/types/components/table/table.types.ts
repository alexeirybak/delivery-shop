import { Category } from "../..";

export interface CategoryTableProps {
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedCategories: Category[]) => void;
}

export type SortField = "numericId" | "name" | "slug" | "createdAt" | "author" | "articles";
export type SortDirection = "asc" | "desc";

export type FilterType =
  | "all"
  | "name"
  | "slug"
  | "description"
  | "keywords"
  | "author";
