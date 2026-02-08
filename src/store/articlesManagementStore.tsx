import {
  Article,
  ArticleStatus,
  FilterType,
  SortField,
} from "@/app/(admin)/administrator/(cms)/cms/articles/articlesManagement/types";
import { CONFIG_BLOG } from "@/app/(admin)/administrator/(cms)/cms/CONFIG_BLOG";

import { SortDirection } from "mongodb";
import { create } from "zustand";

interface ArticlesManagementStore {
  articles: Article[];
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

  setArticles: (categories: Article[]) => void;
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
  loadArticles: (params?: {
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

  updateArticleStatus: (
    articleId: string,
    newStatus: ArticleStatus,
  ) => Promise<void>;

  updateArticleFeatured: (
    articleId: string,
    isFeatured: boolean,
  ) => Promise<void>;
}

export const useArticlesManagementStore = create<ArticlesManagementStore>(
  (set, get) => ({
    articles: [],
    totalAllItems: 0,
    totalItems: 0,
    totalPages: 0,
    loading: false,
    isSubmitting: false,
    isReordering: false,
    currentPage: 1,
    itemsPerPage: CONFIG_BLOG.ITEMS_PER_PAGE,
    sortField: "numericId" as SortField,
    sortDirection: "asc" as SortDirection,
    searchQuery: "",
    filterType: "all" as FilterType,
    draggedId: null,
    dragOverId: null,

    setArticles: (articles) => set({ articles }),
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

    loadArticles: async (params?: {
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
        queryParams.append("search", search.toString());
        queryParams.append("filterBy", filterBy.toString());

        queryParams.append("limit", state.itemsPerPage.toString());

        const response = await fetch(
          `/administrator/cms/api/articles/articles-management?${queryParams}`,
        );
        const data = await response.json();

        if (data.success) {
          set({
            articles: data.data.articles,
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

    updateArticleStatus: async (
      articleId: string,
      newStatus: ArticleStatus,
    ) => {
      try {
        set({ isSubmitting: true });

        const response = await fetch(
          `/administrator/cms/api/articles/articles-management/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: articleId,
              status: newStatus,
            }),
          },
        );

        const data = await response.json();

        if (data.success) {
          const { articles } = get();
          const updatedArticles = articles.map((article) =>
            article._id.toString() === articleId
              ? { ...article, status: newStatus }
              : article,
          );

          set({ articles: updatedArticles });
        } else {
          throw new Error(data.message || "Ошибка изменения статуса");
        }
      } catch (error) {
        console.error("Ошибка изменения статуса статьи:", error);
        throw error;
      } finally {
        set({ isSubmitting: false });
      }
    },

    updateArticleFeatured: async (articleId: string, isFeatured: boolean) => {
      try {
        set({ isSubmitting: true });

        const response = await fetch(
          `/administrator/cms/api/articles/articles-management/featured`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: articleId,
              isFeatured,
            }),
          },
        );

        const data = await response.json();

        if (data.success) {
          const { articles } = get();
          const updatedArticles = articles.map((article) =>
            article._id.toString() === articleId
              ? { ...article, isFeatured }
              : article,
          );

          set({ articles: updatedArticles });
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
