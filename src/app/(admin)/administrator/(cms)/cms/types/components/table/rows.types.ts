import { Category } from "../../models/category";

export interface SortableItemProps {
  id: string;
  category: Category;
  displayNumericId: number | null;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;

}

export interface MobileCategoryCardProps {
  category: Category;
  displayNumericId: number | null;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
}

export interface DesktopCategoryRowProps {
  category: Category;
  displayNumericId: number | null;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
}

export interface DesktopCategoryRowProps {
  category: Category;
  displayNumericId: number | null;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isDragging: boolean; // Добавлено
}

export interface MobileCategoryCardProps {
  category: Category;
  displayNumericId: number | null;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isDragging: boolean;
}

export interface MobileCategoryHeaderProps {
  category: Category;
  displayNumericId: number | null;
}

export interface MobileExpandableContentProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}