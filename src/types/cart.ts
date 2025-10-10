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
  onCheckout?: () => void;
  isCheckout?: boolean;
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

// Базовый интерфейс для общих пропсов корзины
export interface CartBaseProps {
  visibleCartItems: CartItem[];
  totalMaxPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  isMinimumReached: boolean;
}

// Расширяем базовый интерфейс для CartSummary
export interface CartSummaryProps extends CartBaseProps {
  onCheckout?: () => void;
  isCheckout?: boolean;
}

// Интерфейс для бонусной секции
export interface BonusesSectionProps {
  bonusesCount: number;
  useBonuses: boolean;
  onUseBonusesChange: (use: boolean) => void;
  totalPrice: number;
}

// Полный интерфейс для CartSidebar
export interface CartSidebarProps extends CartBaseProps, BonusesSectionProps {
  onCheckout?: () => void;
  isCheckout?: boolean;
}