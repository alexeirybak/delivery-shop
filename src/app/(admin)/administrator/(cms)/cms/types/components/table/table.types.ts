import { Category } from "../..";

export interface CategoryTableProps {
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}
