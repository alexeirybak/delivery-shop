import {
  FilterType,
  SortField,
} from "@/app/(user-part)/user-dashboard/(workbook)/records-management/types";
import { Record } from "@/app/(user-part)/user-dashboard/(workbook)/records/types";
import { CONFIG_CATEGORIES } from "@/app/(user-part)/user-dashboard/(workbook)/records/utils/CONFIG_CATEGORIES";

import { SortDirection } from "mongodb";
import { create } from "zustand";

interface RecordsManagementStore {
  records: Record[];
  totalItems: number;
  totalPages: number;
  totalAllItems: number;
  loading: boolean;
  isSubmitting: boolean;
  isReordering: boolean;
  currentPage: number;
  itemsPerPage: number;
  sortField: SortField;
  sortDirection: SortDirection;
  searchQuery: string;
  filterType: FilterType;

  draggedId: string | null;
  dragOverId: string | null;

  setRecords: (categories: Record[]) => void;
  setTotalItems: (totalItems: number) => void;
  setTotalPages: (totalPages: number) => void;
  setTotalAllItems: (totalAllItems: number) => void;
  setLoading: (loading: boolean) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setIsReordering: (isReordering: boolean) => void;
  setCurrentPage: (currentPage: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  setSortField: (sortField: SortField) => void;
  setSortDirection: (sortDirection: SortDirection) => void;
  loadRecords: (params?: {
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

  updateRecordFeatured: (
    recordId: string,
    isFeatured: boolean,
  ) => Promise<void>;
}

export const useRecordsManagementStore = create<RecordsManagementStore>(
  (set, get) => ({
    records: [],
    totalAllItems: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
    isSubmitting: false,
    isReordering: false,
    currentPage: 1,
    itemsPerPage: CONFIG_CATEGORIES.ITEMS_PER_PAGE,
    sortField: "numericId" as SortField,
    sortDirection: "asc" as SortDirection,
    searchQuery: "",
    filterType: "all" as FilterType,
    draggedId: null,
    dragOverId: null,

    setRecords: (records) => set({ records }),
    setTotalAllItems: (totalAllItems) => set({ totalAllItems }),
    setTotalItems: (totalItems) => set({ totalItems }),
    setTotalPages: (totalPages) => set({ totalPages }),
    setLoading: (loading) => set({ loading }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setIsReordering: (isReordering) => set({ isReordering }),
    setCurrentPage: (currentPage) => set({ currentPage }),
    setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
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

    loadRecords: async (params?: {
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
        queryParams.append("sortBy", state.sortField.toString());
        queryParams.append("sortOrder", state.sortDirection.toString());
        queryParams.append("search", search);
        queryParams.append("filterBy", filterBy);
        queryParams.append("limit", state.itemsPerPage.toString());

        const response = await fetch(
          `/api/workbook/records-management?${queryParams}`,
        );
        const data = await response.json();

        if (data.success) {
          set({
            records: data.data.records,
            totalAllItems: data.data.totalInDB,
            totalItems: data.data.pagination.total,
            totalPages: data.data.pagination.totalPages,
            currentPage: pageToLoad,
          });
        }
      } catch (error) {
        console.error("Ошибка загрузки записей:", error);
      } finally {
        set({ loading: false });
      }
    },

    updateRecordFeatured: async (recordId: string, isFeatured: boolean) => {
      try {
        set({ isSubmitting: true });

        const response = await fetch(
          `/api/workbook/records-management/featured`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: recordId,
              isFeatured,
            }),
          },
        );

        const data = await response.json();

        if (data.success) {
          const { records } = get();
          const updatedRecords = records.map((record) =>
            record._id.toString() === recordId
              ? { ...record, isFeatured }
              : record,
          );

          set({ records: updatedRecords });
        } else {
          throw new Error(data.message || "Ошибка изменения избранности");
        }
      } catch (error) {
        console.error("Ошибка изменения избранности статьи:", error);
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },
  }),
);
