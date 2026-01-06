import { Category } from "../../models/category";

export type SortField = "numericId" | "name" | "slug" | "createdAt" | "author";
export type SortDirection = "asc" | "desc";
export type FilterType =
  | "all"
  | "name"
  | "slug"
  | "description"
  | "keywords"
  | "author"
  | "image"
  | "imageAlt";

export interface CategoryTableProps {
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export interface ExtendedCategoryTableProps extends CategoryTableProps {
  onReorder?: (reorderedCategories: Category[]) => void;
}

export interface TableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}
