import { ProductCardProps } from "./product";

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface CartSummaryProps {
  visibleCartItems: CartItem[];
  totalMaxPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  isMinimumReached: boolean;
}

export interface CartItemProps {
  item: {
    productId: string;
    addedAt: Date;
    quantity: number;
  };
  productData: ProductCardProps | undefined;
  isSelected: boolean;
  onSelectionChange: (productId: string, isSelected: boolean) => void;
  onQuantityUpdate: (productId: string, newQuantity: number) => void;
  hasLoyaltyCard: boolean;
}

export interface OrderCartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
  hasLoyaltyDiscount: boolean;
}
