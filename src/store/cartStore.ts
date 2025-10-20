import { create } from "zustand";
import { CartItem } from "../types/cart";
import { CartState, PricingState } from "@/types/storeStates";

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  totalItems: 0,
  isLoading: false,
  pricing: {
    totalPrice: 0,
    totalMaxPrice: 0,
    totalDiscount: 0,
    finalPrice: 0,
    maxBonusUse: 0,
    totalBonuses: 0,
    isMinimumReached: false,
  },
  hasLoyaltyCard: false,
  useBonuses: false,
  isCheckout: false,
  isOrdered: false,

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

  updatePricing: (pricing: PricingState) => {
    set({ pricing });
  },

  setHasLoyaltyCard: (hasLoyaltyCard: boolean) => {
    set({ hasLoyaltyCard });
  },

  setUseBonuses: (useBonuses: boolean) => {
    set({ useBonuses });
  },

  setIsCheckout: (isCheckout: boolean) => {
    set({ isCheckout });
  },

  setIsOrdered: (isOrdered: boolean) => {
    set({ isOrdered });
  },

  resetAfterOrder: () => {
    set({
      cartItems: [],
      totalItems: 0,
      isCheckout: false,
      isOrdered: false,
      useBonuses: false,
      pricing: {
        totalPrice: 0,
        totalMaxPrice: 0,
        totalDiscount: 0,
        finalPrice: 0,
        maxBonusUse: 0,
        totalBonuses: 0,
        isMinimumReached: false,
      },
    });
  },
}));
