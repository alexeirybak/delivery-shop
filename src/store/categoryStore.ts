// store/categoryStore.ts
import { create } from "zustand";
import { Category } from "@/app/(admin)/administrator/(cms)/cms/types";

interface CategoryStore {
  // Данные
  categories: Category[];
  totalItems: number;
  totalPages: number;
  totalAllItems: number;
  editingId: string | null; // ← Тип в интерфейсе

  // Методы
  setCategories: (categories: Category[]) => void;
  setTotalItems: (totalItems: number) => void;
  setTotalPages: (totalPages: number) => void;
  setTotalAllItems: (totalAllItems: number) => void;
  setEditingId: (editingId: string | null) => void;
  clearEditingId: () => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  // Начальные значения
  categories: [],
  totalItems: 0,
  totalPages: 0,
  totalAllItems: 0,
  editingId: null, // ← Начальное значение

  // Реализации методов
  setCategories: (categories) => set({ categories }),
  setTotalItems: (totalItems) => set({ totalItems }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setTotalAllItems: (totalAllItems) => set({ totalAllItems }),
  setEditingId: (editingId) => set({ editingId }),
  clearEditingId: () => set({ editingId: null }),
}));