import { Category } from "../../models";

export interface MobileCategoryHeaderProps {
  category: Category;
  displayNumericId: number | null;
}

export interface SortableItemProps {
  category: Category;
  displayNumericId: number | null;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export interface MobileExpandableContentProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}
