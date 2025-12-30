import { create } from "zustand";
import {
  Category,
  CategoryFormData,
} from "@/app/(admin)/administrator/(cms)/cms/types";
import { CONFIG_BLOG } from "@/app/(admin)/administrator/(cms)/cms/CONFIG_BLOG";

interface CategoryStore {
  // Данные
  categories: Category[];
  totalItems: number;
  totalPages: number;
  totalAllItems: number;
  editingId: string | null;
  currentPage: number;
  itemsPerPage: number;
  loading: boolean;
  isReordering: boolean; // Добавляем
  isSubmitting: boolean; // Добавляем
  isSearching: boolean; // Добавляем
  isUploading: boolean; // Добавляем
  showForm: boolean; // Добавляем
  originalImageUrl: string; // Добавляем
  formData: CategoryFormData;

  // Методы
  setCategories: (categories: Category[]) => void;
  setTotalItems: (totalItems: number) => void;
  setTotalPages: (totalPages: number) => void;
  setTotalAllItems: (totalAllItems: number) => void;
  setEditingId: (editingId: string | null) => void;
  clearEditingId: () => void;
  setCurrentPage: (currentPage: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setLoading: (loading: boolean) => void;
  setIsReordering: (isReordering: boolean) => void; // Добавляем
  setIsSubmitting: (isSubmitting: boolean) => void; // Добавляем
  setIsSearching: (isSearching: boolean) => void; // Добавляем
  setIsUploading: (isUploading: boolean) => void; // Добавляем
  setShowForm: (showForm: boolean) => void; // Добавляем
  setOriginalImageUrl: (originalImageUrl: string) => void;
  setFormData: (formData: CategoryFormData) => void; // Добавляем
  updateFormField: (field: keyof CategoryFormData, value: string) => void; // Добавляем
  resetFormData: () => void; // Добавляем
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  // Начальные значения
  categories: [],
  totalItems: 0,
  totalPages: 0,
  totalAllItems: 0,
  editingId: null,
  currentPage: 1,
  itemsPerPage: CONFIG_BLOG.ITEMS_PER_PAGE,
  loading: false,
  isReordering: false, // Начальное значение
  isSubmitting: false, // Начальное значение
  isSearching: false, // Начальное значение
  isUploading: false, // Начальное значение
  showForm: false, // Начальное значение
  originalImageUrl: "", // Начальное значение
  formData: {
    // Начальное значение для formData
    name: "",
    slug: "",
    description: "",
    keywords: "",
    image: "",
    imageAlt: "",
  },

  // Реализации методов
  setCategories: (categories) => set({ categories }),
  setTotalItems: (totalItems) => set({ totalItems }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setTotalAllItems: (totalAllItems) => set({ totalAllItems }),
  setEditingId: (editingId) => set({ editingId }),
  clearEditingId: () => set({ editingId: null }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
  setLoading: (loading) => set({ loading }),
  setIsReordering: (isReordering) => set({ isReordering }), // Добавляем
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }), // Добавляем
  setIsSearching: (isSearching) => set({ isSearching }), // Добавляем
  setIsUploading: (isUploading) => set({ isUploading }), // Добавляем
  setShowForm: (showForm) => set({ showForm }), // Добавляем
  setOriginalImageUrl: (originalImageUrl) => set({ originalImageUrl }),
  setFormData: (formData) => set({ formData }),
  updateFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),
  resetFormData: () =>
    set({
      formData: {
        name: "",
        slug: "",
        description: "",
        keywords: "",
        image: "",
        imageAlt: "",
      },
    }),
}));
