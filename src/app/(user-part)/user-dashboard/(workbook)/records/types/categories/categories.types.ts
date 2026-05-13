export interface Category {
  _id: string;
  numericId: number;
  name: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  recordsCount?: string;
}
export interface UpdateCategoryData {
  name: string;
  description: string;
  image: string;
}

export interface ReorderRequestItem {
  _id: string;
  numericId: number;
}

export interface DragHandleProps {
  ref: React.Ref<HTMLDivElement>;
}

export interface CategoryFormData {
  name: string;
  description: string;
  image: string;
}

export interface CategoryFormFieldsProps {
  onInputChange: (field: CategoryFormField, value: string) => void;
}

export interface CategoryFormProps {
  onFieldChange: (field: CategoryFormField, value: string) => void;
  onSaveImageFile: (file: File) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.SyntheticEvent) => Promise<void>;
  onCancel: () => void;
  errors?: Record<string, string>;
}

export type CategoryFormField = keyof CategoryFormData;

export interface MobileCategoryHeaderProps {
  category: Category;
  displayNumericId: number | null;
}

export interface SortableItemProps {
  category: Category;
  displayNumericId: number | null;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  isDragging?: boolean;
  id?: string;
}

export interface MobileExpandableContentProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export interface CategoryTableProps {
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onReorder?: (reorderedCategories: Category[]) => void;
}

export type SortField = "numericId" | "name" | "createdAt";
export type SortDirection = "asc" | "desc";

export type FilterType = "all" | "name" | "description";

export interface SubmitSectionProps {
  onCancel: () => void;
}

export interface HeaderActionsProps {
  onCreate: () => void;
}

export interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export interface FilterControlsProps {
  onToggleFilters?: (show: boolean) => void;
}
