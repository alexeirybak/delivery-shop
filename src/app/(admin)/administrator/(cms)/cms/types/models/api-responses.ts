import { Category } from "./category";

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  loadCategories: () => Promise<void>;
  createCategory: (
    data: Omit<Category, "_id" | "createdAt" | "updatedAt">
  ) => Promise<ApiResponse>;
  updateCategory: (
    id: string,
    data: Partial<Omit<Category, "_id" | "createdAt" | "updatedAt">>
  ) => Promise<ApiResponse>;
  deleteCategory: (id: string) => Promise<ApiResponse>;
  reorderCategories: (
    reorderedCategories: Array<{ _id: string; numericId: number }>
  ) => Promise<ApiResponse>;
}
