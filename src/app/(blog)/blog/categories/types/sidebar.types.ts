import { BlogCategory, CategoriesSidebarProps } from "./categories.types";

export interface BlogCategoriesListProps {
  categories: BlogCategory[];
  searchQuery: string;
  onItemClick: () => void;
}

export interface BlogCategoryItemProps {
  category: BlogCategory;
  index: number;
  onClick: () => void;
}

export interface FloatingMenuButtonProps {
  onClick: () => void;
  categoriesCount: number;
}

export interface SidebarSearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface SidebarContentProps extends CategoriesSidebarProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export interface SidebarHeaderProps {
  categoriesCount: number;
  onClose: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export interface SidebarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}