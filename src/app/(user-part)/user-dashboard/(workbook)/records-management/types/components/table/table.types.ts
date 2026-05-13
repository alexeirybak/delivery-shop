import { Record } from "../../models";

export interface RecordTableProps {
  onReorder?: (reorderedRecords: Record[]) => void;
  onDelete?: (id: string) => void;
}

export type SortField =
  | "numericId"
  | "name"
  | "category"
  | "categoryName"
  | "isFeatured"
  | "createdAt";

export type SortDirection = "asc" | "desc";

export type FilterType =
  | "all"
  | "name"
  | "content"
  | "description"
  | "categoryName";
