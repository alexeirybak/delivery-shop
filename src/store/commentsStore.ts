import {
  LoadCommentsParams,
} from "@/app/(admin)/administrator/(cms)/cms/comments/types/comments.types";
import { CONFIG_BLOG } from "@/app/(admin)/administrator/(cms)/cms/CONFIG_BLOG";
import { IComment } from "@/app/(blog)/blog/types";
import { create } from "zustand";

// Интерфейс для информации о бане
export interface BannedUserInfo {
  isBanned: boolean;
  bannedUntil: string | null;
}

interface CommentsStore {
  comments: IComment[];
  totalItems: number;
  totalPages: number;
  totalAllItems: number;
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  bannedUsers: Record<string, BannedUserInfo>; // храним объект с isBanned и bannedUntil

  setComments: (comments: IComment[]) => void;
  setTotalItems: (totalItems: number) => void;
  setTotalPages: (totalPages: number) => void;
  setTotalAllItems: (totalAllItems: number) => void;
  setLoading: (loading: boolean) => void;
  setCurrentPage: (currentPage: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  loadComments: (params?: LoadCommentsParams) => Promise<void>;
  setUserBanned: (userId: string, isBanned: boolean, bannedUntil?: string | null) => void; // обновленный метод
}

export const useCommentsStore = create<CommentsStore>((set, get) => ({
  comments: [],
  totalAllItems: 0,
  totalItems: 0,
  totalPages: 0,
  loading: false,
  currentPage: 1,
  itemsPerPage: CONFIG_BLOG.COMMENTS_PER_COMMENT_PAGE,
  bannedUsers: {},

  setComments: (comments) => set({ comments }),
  setTotalAllItems: (totalAllItems) => set({ totalAllItems }),
  setTotalItems: (totalItems) => set({ totalItems }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setLoading: (loading) => set({ loading }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
  
  // обновленный метод для сохранения статуса и даты бана
  setUserBanned: (userId: string, isBanned: boolean, bannedUntil?: string | null) => {
    set((state) => ({
      bannedUsers: {
        ...state.bannedUsers,
        [userId]: { 
          isBanned, 
          bannedUntil: bannedUntil || null 
        }
      }
    }));
  },

  loadComments: async (params?: LoadCommentsParams) => {
    const state = get();

    set({ loading: true });
    try {
      const queryParams = new URLSearchParams();

      const pageToLoad = params?.page ?? state.currentPage;
      const dateFrom = params?.dateFrom ?? "";
      const dateTo = params?.dateTo ?? "";
      const author = params?.author ?? ""; 
      const article = params?.article ?? "";

      queryParams.append("page", pageToLoad.toString());
      queryParams.append("limit", state.itemsPerPage.toString());

      if (dateFrom) queryParams.append("dateFrom", dateFrom);
      if (dateTo) queryParams.append("dateTo", dateTo);
      if (author) queryParams.append("author", author); 
      if (article) queryParams.append("article", article); 

      const response = await fetch(
        `/administrator/cms/api/comments?${queryParams}`,
      );
      const data = await response.json();

      if (data.comments) {
        set({
          comments: data.comments,
          totalItems: data.totalItems || 0,
          totalAllItems: data.totalAllItems || 0,
          totalPages: data.totalPages || 1,
          currentPage: pageToLoad,
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки комментариев:", error);
    } finally {
      set({ loading: false });
    }
  },
}));