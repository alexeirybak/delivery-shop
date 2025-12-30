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
  searchQuery: string;
  filterType: FilterType;
  sortField: SortField;
  sortDirection: SortDirection;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
  onFilterTypeChange: (type: FilterType) => void;
  onSortFieldChange: (field: SortField) => void;
  onSortDirectionChange: (direction: SortDirection) => void;
  isSearching?: boolean;
}

export interface TableHeaderProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}
