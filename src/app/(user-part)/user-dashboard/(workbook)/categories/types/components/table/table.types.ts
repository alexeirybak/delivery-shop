import { Category } from "../../../../records/types/categories/categories.types";

export interface CategoryTableProps {
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedCategories: Category[]) => void;
}

export type SortField = "numericId" | "name" | "createdAt" | "author" | "records";
export type SortDirection = "asc" | "desc";

export type FilterType =
  | "all"
  | "name"
  | "description"
  | "keywords"
