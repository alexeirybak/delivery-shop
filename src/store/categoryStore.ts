import { create } from "zustand";
import {
  Category,
  CategoryFormData,
  FilterType,
  SortField,
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
  isReordering: boolean;
  isSubmitting: boolean;
  isSearching: boolean;
  isUploading: boolean;
  showForm: boolean;
  originalImageUrl: string;
  formData: CategoryFormData;
  filterType: FilterType;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  searchQuery: string;

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
  setIsReordering: (isReordering: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsSearching: (isSearching: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;
  setShowForm: (showForm: boolean) => void;
  setOriginalImageUrl: (originalImageUrl: string) => void;
  setFormData: (formData: CategoryFormData) => void;
  updateFormField: (field: keyof CategoryFormData, value: string) => void;
  resetFormData: () => void;

  setFilterType: (filterType: FilterType) => void;
  setSortField: (sortField: SortField) => void;
  setSortDirection: (sortDirection: "asc" | "desc") => void;
  setSearchQuery: (searchQuery: string) => void;

  // Метод для сброса всех фильтров
  resetFilters: () => void;
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
  isReordering: false,
  isSubmitting: false,
  isSearching: false,
  isUploading: false,
  showForm: false,
  originalImageUrl: "",
  formData: {
    name: "",
    slug: "",
    description: "",
    keywords: "",
    image: "",
    imageAlt: "",
  },
  filterType: "all",
  sortField: "numericId",
  sortDirection: "asc",
  searchQuery: "",

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
  setIsReordering: (isReordering) => set({ isReordering }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setIsSearching: (isSearching) => set({ isSearching }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setShowForm: (showForm) => set({ showForm }),
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

  setFilterType: (filterType) => set({ filterType }),
  setSortField: (sortField) => set({ sortField }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  resetFilters: () =>
    set({
      filterType: "all",
      sortField: "numericId",
      sortDirection: "asc",
      searchQuery: "",
      currentPage: 1,
    }),
}));
