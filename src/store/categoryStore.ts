import { create } from "zustand";
import {
  Category,
  CategoryFormData,
  SortField,
  FilterType,
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

  // Состояние сортировки
  sortField: SortField;
  sortDirection: "asc" | "desc";

  // Поиск и фильтры
  searchQuery: string;
  filterType: FilterType;

  // Данные формы
  formData: CategoryFormData;

  // Базовые сеттеры
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

  // Работа с формой
  setFormData: (formData: CategoryFormData) => void;
  updateFormField: (field: keyof CategoryFormData, value: string) => void;
  resetFormData: () => void;

  // Сортировка
  setSortField: (sortField: SortField) => void;
  setSortDirection: (sortDirection: "asc" | "desc") => void;

  // Поиск и фильтры
  setSearchQuery: (searchQuery: string) => void;
  setFilterType: (filterType: FilterType) => void;

  // Утилиты поиска
  handleSearchChange: (value: string) => void;
  handleSearchClear: () => void;

  // ⬇️ ГЛАВНОЕ: loadCategories в store!
  loadCategories: (params?: {
    page?: number;
    search?: string;
    filterBy?: FilterType;
  }) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
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

  sortField: "numericId" as SortField,
  sortDirection: "asc" as "asc" | "desc",

  searchQuery: "",
  filterType: "all" as FilterType,

  formData: {
    name: "",
    slug: "",
    description: "",
    keywords: "",
    image: "",
    imageAlt: "",
  },

  // Базовые сеттеры
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

  // Работа с формой
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
      queryParams.append("pageToLoad", pageToLoad.toString());
      queryParams.append("limit", state.itemsPerPage.toString());

      const search = params?.search ?? state.searchQuery;
      const filterBy = params?.filterBy ?? state.filterType;

      queryParams.append("search", search);
      queryParams.append("filterBy", filterBy);

      queryParams.append("sortBy", state.sortField);
      queryParams.append("sortOrder", state.sortDirection);

      const response = await fetch(
        `/administrator/cms/api/categories?${queryParams.toString()}`
      );
      const data = await response.json();
      console.log(data);

      if (data.success) {
        set({
          categories: data.data.categories,
          totalPages: data.data.pagination.totalPages,
          totalItems: data.data.pagination.total,
          totalAllItems: data.data.totalInDB,
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
