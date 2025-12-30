import { Category } from "../../models/category";
import { DragHandleProps } from "../dnd/drag-drop.types";

export interface SortableItemProps {
  id: string;
  category: Category;
  displayNumericId: number | null;
  isExpanded: boolean;
  activeId: string | null;
  onToggle: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export interface DesktopCategoryRowProps {
  category: Category;
  displayNumericId: number | null;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  dragHandleProps: DragHandleProps;
  style: React.CSSProperties;
  isDragging: boolean;
  isActiveDragging: boolean;
}

export interface MobileCategoryCardProps {
  category: Category;
  displayNumericId: number | null;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  dragHandleProps: DragHandleProps;
  style: React.CSSProperties;
  isDragging: boolean;
  isActiveDragging: boolean;
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