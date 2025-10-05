import { create } from "zustand";
import { CartItem } from "../types/cart";

interface CartState {
  cartItems: CartItem[];
  totalItems: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  updateCart: (items: CartItem[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  totalItems: 0,
  isLoading: false,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch("/api/cart");

      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }

      const cartItems = await response.json();

      const totalItems = cartItems.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
      );

      set({
        cartItems,
        totalItems,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ isLoading: false });
    }
  },

  updateCart: (items: CartItem[]) => {
    set({
      cartItems: items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  },

  clearCart: () => {
    set({
      cartItems: [],
      totalItems: 0,
    });
  },
}));
