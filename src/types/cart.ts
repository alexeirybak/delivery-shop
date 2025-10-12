// types/cart.ts
import { ProductCardProps } from "./product";
import { DeliveryAddress, DeliveryTime } from "./order";

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
  totalPrice: number;
  totalBonuses: number;
  isMinimumReached: boolean;
  onCheckout?: () => void;
  isCheckout?: boolean;
  deliveryData?: {
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  } | null; // Добавляем null
  useBonuses?: boolean;
  bonusesCount?: number;
  productsData?: { [key: string]: ProductCardProps };
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

export interface CartBaseProps {
  visibleCartItems: CartItem[];
  totalMaxPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  isMinimumReached: boolean;
}

export interface CartSummaryProps extends CartBaseProps {
  onCheckout?: () => void;
  isCheckout?: boolean;
  deliveryData?: {
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  } | null;
  useBonuses?: boolean;
  bonusesCount?: number;
  productsData?: { [key: string]: ProductCardProps };
}

export interface BonusesSectionProps {
  bonusesCount: number;
  useBonuses: boolean;
  onUseBonusesChange: (use: boolean) => void;
  totalPrice: number;
}

export interface CartSidebarProps extends CartBaseProps, BonusesSectionProps {
  onCheckout?: () => void;
  isCheckout?: boolean;
  deliveryData?: {
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  } | null; 
  productsData?: { [key: string]: ProductCardProps };
}