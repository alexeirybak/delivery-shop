import { CartItem } from "./cart";

export interface PricingState {
  totalPrice: number;
  totalMaxPrice: number;
  totalDiscount: number;
  finalPrice: number;
  maxBonusUse: number;
  totalBonuses: number;
  isMinimumReached: boolean;
}

export interface CartState {
  cartItems: CartItem[];
  totalItems: number;
  isLoading: boolean;
  pricing: PricingState;
  isCheckout: boolean;
  isOrdered: boolean;
  hasLoyaltyCard: boolean;
  useBonuses: boolean;
  fetchCart: () => Promise<void>;
  updateCart: (items: CartItem[]) => void;
  clearCart: () => void;
  updatePricing: (pricing: PricingState) => void;
  setIsCheckout: (isCheckout: boolean) => void;
  setIsOrdered: (isOrdered: boolean) => void;
  setHasLoyaltyCard: (value: boolean) => void;
  setUseBonuses: (value: boolean) => void;
  resetAfterOrder: () => void;
}
