// import { ReactNode } from "react";
// import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

// export interface ApiResponse {
//   success: boolean;
//   message?: string;
// }

// export interface Category {
//   _id: string;
//   numericId: number;
//   name: string;
//   slug: string;
//   description: string;
//   keywords: string[];
//   image: string;
//   imageAlt: string;
//   author: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CategoryFormData {
//   name: string;
//   slug: string;
//   description: string;
//   keywords: string;
//   image: string;
//   imageAlt: string;
// }

// export interface CategoryInput {
//   name: string;
//   slug: string;
//   description: string;
//   keywords: string[];
//   image: string;
//   imageAlt: string;
//   author: string;
// }

// export interface UpdateCategoryInput {
//   name?: string;
//   slug?: string;
//   description?: string;
//   keywords?: string[];
//   image?: string;
//   imageAlt?: string;
//   author?: string;
// }

// export interface UseCategoriesResult {
//   categories: Category[];
//   loading: boolean;
//   loadCategories: () => Promise<void>;
//   createCategory: (
//     data: Omit<Category, "_id" | "createdAt" | "updatedAt">
//   ) => Promise<ApiResponse>;
//   updateCategory: (
//     id: string,
//     data: Partial<Omit<Category, "_id" | "createdAt" | "updatedAt">>
//   ) => Promise<ApiResponse>;
//   deleteCategory: (id: string) => Promise<ApiResponse>;
//   reorderCategories: (
//     reorderedCategories: Array<{ _id: string; numericId: number }>
//   ) => Promise<ApiResponse>;
// }

// export type FormField = keyof CategoryFormData;

// export interface CategoryFormProps {
//   formData: CategoryFormData;
//   errors: Record<string, string>;
//   editingId: string | null;
//   isSubmitting?: boolean;
//   onFieldChange: (field: FormField, value: string) => void;
//   onGenerateSlug: () => void;
//   onSaveImageFile: (file: File) => void;
//   onRemoveImage: () => void;
//   onSubmit: (e: React.FormEvent) => void;
//   onCancel: () => void;
// }

// export interface TableHeaderProps {
//   sortField: SortField;
//   sortDirection: SortDirection;
//   onSort: (field: SortField) => void;
// }

// export interface CategoryTableProps {
//   categories: Category[];
//   loading: boolean;
//   onEdit: (category: Category) => void;
//   onDelete: (id: string) => void;
// }

// export interface DragEndEvent {
//   active: { id: string };
//   over: { id: string } | null;
// }

// export interface SortableItemProps {
//   id: string;
//   category: Category;
//   displayNumericId: number | null;
//   isExpanded: boolean;
//   onToggle: (id: string) => void;
//   onEdit: (category: Category) => void;
//   onDelete: (id: string) => void;
//   isMobile?: boolean;
// }

// export type SortField = "numericId" | "name" | "slug" | "createdAt" | "author";
// export type SortDirection = "asc" | "desc";
// export type FilterType =
//   | "all"
//   | "name"
//   | "slug"
//   | "description"
//   | "keywords"
//   | "author"
//   | "image"
//   | "imageAlt";

// export interface ResultsStatsProps {
//   filteredCount: number;
//   totalItems: number;
//   searchQuery: string;
// }

// export interface FilterControlsProps {
//   showFilters: boolean;
//   onToggleFilters: () => void;
//   onResetFilters: () => void;
//   hasActiveFilters: boolean;
// }

// export interface NotificationProps {
//   type: "success" | "error" | "warning";
//   message: string;
//   onClose: () => void;
//   children?: ReactNode;
// }

// export interface DragHandleAttributes {
//   role: string;
//   "aria-describedby": string;
//   tabIndex: number;
// }

// export interface DragHandleListeners {
//   onKeyDown?: (event: React.KeyboardEvent) => void;
//   onPointerDown?: (event: React.PointerEvent) => void;
// }

// export interface DragHandleProps {
//   ref: React.Ref<HTMLDivElement>;
//   attributes: DragHandleAttributes;
//   listeners: SyntheticListenerMap | undefined;
//   onClick: (e: React.MouseEvent) => void;
// }

// export interface MobileCategoryCardProps {
//   category: Category;
//   displayNumericId: number | null;
//   isExpanded: boolean;
//   onToggle: (id: string) => void;
//   onEdit: (category: Category) => void;
//   onDelete: (id: string) => void;
//   dragHandleProps: DragHandleProps;
//   style: React.CSSProperties;
//   isDragging: boolean;
//   isActiveDragging: boolean;
// }

// export interface MobileCategoryHeaderProps {
//   category: Category;
//   displayNumericId: number | null;
// }

// export interface MobileExpandableContentProps {
//   category: Category;
//   onEdit: (category: Category) => void;
//   onDelete: (id: string) => void;
// }

// export interface DesktopCategoryRowProps {
//   category: Category;
//   displayNumericId: number | null;
//   onEdit: (category: Category) => void;
//   onDelete: (id: string) => void;
//   dragHandleProps: DragHandleProps;
//   style: React.CSSProperties;
//   isDragging: boolean;
//   isActiveDragging: boolean;
// }

// export interface AdvancedFiltersProps {
//   filterType: FilterType;
//   sortField: SortField;
//   sortDirection: "asc" | "desc";
//   onFilterTypeChange: (type: FilterType) => void;
//   onSortFieldChange: (field: SortField) => void;
//   onSortDirectionChange: (direction: "asc" | "desc") => void;
// }

// export interface ExtendedCategoryTableProps extends CategoryTableProps {
//   onReorder?: (reorderedCategories: Category[]) => void;
//   searchQuery: string;
//   filterType: FilterType;
//   sortField: SortField;
//   sortDirection: SortDirection;
//   onSearchChange: (query: string) => void;
//   onSearch: () => void;
//   onFilterTypeChange: (type: FilterType) => void;
//   onSortFieldChange: (field: SortField) => void;
//   onSortDirectionChange: (direction: SortDirection) => void;
//   isSearching?: boolean;
//   totalItems: number;
// }

// export interface SearchBarProps {
//   value: string;
//   onChange: (value: string) => void;
//   onSearch: () => void;
//   placeholder?: string;
//   isSearching?: boolean;
// }

// export interface ReorderStatusProps {
//   isReordering: boolean;
// }

// export interface HeaderActionsProps {
//   isReordering: boolean;
//   onCreate: () => void;
// }

// export interface EmptyStateProps {
//   searchQuery: string;
// }

// export interface Transform {
//   x: number;
//   y: number;
//   scaleX: number;
//   scaleY: number;
// }

// export interface Transition {
//   property: string;
//   easing: string;
//   duration: number;
// }

// export interface SubmitSectionProps {
//   isSubmitting: boolean | undefined;
//   editingId: string | null;
//   isUploading: boolean;
//   onCancel: () => void;
// }

// export interface CharCount {
//   name: number;
//   description: number;
//   keywords: number;
//   imageAlt: number;
// }

// export interface FormFieldsProps {
//   formData: CategoryFormData;
//   errors: Record<string, string>;
//   isSubmitting: boolean | undefined;
//   charCount: CharCount;
//   onInputChange: (field: FormField, value: string, maxLength: number) => void;
//   onGenerateSlug: () => void;
// }

// export interface HeaderActionsProps {
//   isReordering: boolean;
//   onCreate: () => void;
// }

// export interface CharCount {
//   name: number;
//   description: number;
//   keywords: number;
//   imageAlt: number;
// }

// export interface ImageSectionProps {
//   formData: CategoryFormData;
//   isUploading: boolean;
//   isSubmitting: boolean | undefined;
//   editingId: string | null;
//   charCount: CharCount;
//   onRemoveImage: () => void;
//   onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onInputChange: (field: FormField, value: string, maxLength: number) => void;
// }
