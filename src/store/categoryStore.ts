import { CONFIG_BLOG } from "@/app/(admin)/administrator/(cms)/cms/CONFIG_BLOG";
import {
  Category,
  CategoryFormData,
  FilterType,
  SortField,
} from "@/app/(admin)/administrator/(cms)/cms/types";
import { SortDirection } from "mongodb";
import { create } from "zustand";

interface CategoryStore {
  categories: Category[];
  totalItems: number;
  totalPages: number;
  totalAllItems: number;
  editingId: string | null;
  loading: boolean;
  isSubmitting: boolean;
  isUploading: boolean;
  isReordering: boolean;
  showForm: boolean;
  originalImageUrl: string;
  formData: CategoryFormData;
  currentPage: number;
  itemsPerPage: number;
  sortField: SortField;
  sortDirection: SortDirection;
  searchQuery: string;
  filterType: FilterType;

  draggedId: string | null;
  dragOverId: string | null;
  tempOrder: Map<string, number>;

  setCategories: (categories: Category[]) => void;
  setTotalItems: (totalItems: number) => void;
  setTotalPages: (totalPages: number) => void;
  setTotalAllItems: (totalAllItems: number) => void;
  setEditingId: (editingId: string | null) => void;
  clearEditingId: () => void;
  setLoading: (loading: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsUploading: (isUploading: boolean) => void;
  setIsReordering: (isReordering: boolean) => void;
  setShowForm: (showForm: boolean) => void;
  setOriginalImageUrl: (originalImageUrl: string) => void;
  setFormData: (formData: CategoryFormData) => void;
  updateFormField: (field: keyof CategoryFormData, value: string) => void;
  resetFormData: () => void;
  setCurrentPage: (currentPage: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setSortField: (sortField: SortField) => void;
  setSortDirection: (sortDirection: SortDirection) => void;
  loadCategories: (params?: {
    page?: number;
    search?: string;
    filterType?: FilterType;
  }) => Promise<void>;
  setSearchQuery: (searchQuery: string) => void;
  setFilterType: (filterType: FilterType) => void;
  handleSearchChange: (value: string) => void;
  handleSearchClear: () => void;

  setDraggedId: (draggedId: string | null) => void;
  setDragOverId: (dragOverId: string | null) => void;
  setTempOrder: (tempOrder: Map<string, number>) => void;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  totalAllItems: 0,
  editingId: null,
  totalItems: 0,
  totalPages: 0,
  loading: false,
  isSubmitting: false,
  isUploading: false,
  isReordering: false,
  showForm: false,
  originalImageUrl: "",
  currentPage: 1,
  itemsPerPage: CONFIG_BLOG.ITEMS_PER_PAGE,
  formData: {
    name: "",
    slug: "",
    description: "",
    keywords: "",
    image: "",
    imageAlt: "",
  },
  sortField: "numericId" as SortField,
  sortDirection: "asc" as SortDirection,
  searchQuery: "",
  filterType: "all" as FilterType,
  draggedId: null,
  dragOverId: null,
  tempOrder: new Map(),

  setCategories: (categories) => set({ categories }),
  setTotalAllItems: (totalAllItems) => set({ totalAllItems }),
  setEditingId: (editingId) => set({ editingId }),
  clearEditingId: () => set({ editingId: null }),
  setTotalItems: (totalItems) => set({ totalItems }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setLoading: (loading) => set({ loading }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setIsUploading: (isUploading) => set({ isUploading }),
  setIsReordering: (isReordering) => set({ isReordering }),
  setShowForm: (showForm) => set({ showForm }),
  setOriginalImageUrl: (originalImageUrl) => set({ originalImageUrl }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setFormData: (formData) => set({ formData }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
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
  setSortField: (sortField) => set({ sortField }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilterType: (filterType) => set({ filterType }),
  handleSearchChange: (value: string) => {
    set({ searchQuery: value });
  },
  handleSearchClear: () => {
    set({ searchQuery: "" });
  },

  setDraggedId: (draggedId) => set({ draggedId }),
  setDragOverId: (dragOverId) => set({ dragOverId }),
  setTempOrder: (tempOrder) => set({ tempOrder }),

  loadCategories: async (params?: {
    page?: number;
    search?: string;
    filterBy?: FilterType;
  }) => {
    const state = get();
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams();
      const pageToLoad = params?.page ?? state.currentPage;
      const search = params?.search ?? state.searchQuery;
      const filterBy = params?.filterBy ?? state.filterType;
      queryParams.append("pageToLoad", pageToLoad.toString());
      queryParams.append("limit", state.itemsPerPage.toString());
      queryParams.append("sortBy", state.sortField.toString());
      queryParams.append("sortOrder", state.sortDirection.toString());
      queryParams.append("search", search.toString());
      queryParams.append("filterBy", filterBy.toString());

      const response = await fetch(
        `/administrator/cms/api/categories?${queryParams}`
      );
      const data = await response.json();

      if (data.success) {
        set({
          categories: data.data.categories,
          totalAllItems: data.data.totalInDB,
          totalItems: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
          currentPage: params?.page ?? state.currentPage,
          searchQuery: params?.search ?? state.searchQuery,
          filterType: params?.filterBy ?? state.filterType,
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
