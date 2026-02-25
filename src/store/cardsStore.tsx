import { create } from "zustand";
import { Card, FilterType, LoadCardsParams } from "@/app/(admin)/administrator/cards/types/cards.types";
import { CONFIG_CARDS } from "@/app/(admin)/administrator/cards/utils/CONFIG_CARDS";

interface CardsStore {
  // Данные
  cards: Card[];
  totalItems: number;
  totalPages: number;
  totalAllItems: number;
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  
  // Фильтры и поиск
  currentFilter: FilterType;
  searchCardNumber: string;
  searchOwner: string;

  // Методы
  setCards: (cards: Card[]) => void;
  setTotalItems: (totalItems: number) => void;
  setTotalPages: (totalPages: number) => void;
  setTotalAllItems: (totalAllItems: number) => void;
  setLoading: (loading: boolean) => void;
  setCurrentPage: (currentPage: number) => void; // для пагинации
  setItemsPerPage: (itemsPerPage: number) => void;
  setCurrentFilter: (filter: FilterType) => void;
  setSearchCardNumber: (search: string) => void;
  setSearchOwner: (search: string) => void;
  resetFilters: () => void;
  loadCards: (params?: LoadCardsParams) => Promise<void>;
  clearStore: () => void;
}

export const useCardsStore = create<CardsStore>((set, get) => ({
  cards: [],
  totalItems: 0,
  totalPages: 0,
  totalAllItems: 0,
  loading: false,
  currentPage: 1,
  itemsPerPage: CONFIG_CARDS.ITEMS_PER_PAGE,
  currentFilter: "all",
  searchCardNumber: "",
  searchOwner: "",

  setCards: (cards) => set({ cards }),
  setTotalItems: (totalItems) => set({ totalItems }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setTotalAllItems: (totalAllItems) => set({ totalAllItems }),
  setLoading: (loading) => set({ loading }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
  setCurrentFilter: (currentFilter) => set({ currentFilter }),
  setSearchCardNumber: (searchCardNumber) => set({ searchCardNumber }),
  setSearchOwner: (searchOwner) => set({ searchOwner }),

  resetFilters: () => set({
    currentFilter: "all",
    searchCardNumber: "",
    searchOwner: "",
    currentPage: 1,
  }),

  clearStore: () => set({
    cards: [],
    totalItems: 0,
    totalPages: 0,
    totalAllItems: 0,
    loading: false,
    currentPage: 1,
    itemsPerPage: 50,
    currentFilter: "all",
    searchCardNumber: "",
    searchOwner: "",
  }),

  loadCards: async (params?: LoadCardsParams) => {
    const state = get();
    
    set({ loading: true });
    
    try {
      const queryParams = new URLSearchParams();
      
      const pageToLoad = params?.page ?? state.currentPage;
      const filter = params?.filter ?? state.currentFilter;
      const searchCardNumber = params?.searchCardNumber ?? state.searchCardNumber;
      const searchOwner = params?.searchOwner ?? state.searchOwner;
      const limit = params?.limit ?? state.itemsPerPage;

      queryParams.append("page", pageToLoad.toString());
      queryParams.append("limit", limit.toString());
      queryParams.append("filter", filter);
      
      if (searchCardNumber) {
        queryParams.append("searchCardNumber", searchCardNumber);
      }
      
      if (searchOwner) {
        queryParams.append("searchOwner", searchOwner);
      }

      const response = await fetch(`/api/admin/cards?${queryParams.toString()}`);
      const data = await response.json();

      if (data.cards) {
        set({
          cards: data.cards,
          totalItems: data.totalItems || 0,
          totalAllItems: data.totalAllItems || 0,
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || pageToLoad, 
          itemsPerPage: limit,
          ...(params?.filter !== undefined && { currentFilter: params.filter }),
          ...(params?.searchCardNumber !== undefined && { searchCardNumber: params.searchCardNumber }),
          ...(params?.searchOwner !== undefined && { searchOwner: params.searchOwner }),
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки карт:", error);
    } finally {
      set({ loading: false });
    }
  },
}));