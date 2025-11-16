import { DeliveryAddress, DeliveryTime } from "./order";
import { ProductCardProps } from "./product";

export interface DeliveryData {
  address: DeliveryAddress;
  time: DeliveryTime;
  isValid: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface CartSummaryProps {
  deliveryData?: {
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  } | null;
  productsData?: { [key: string]: Partial<ProductCardProps> };
}

export interface CartSidebarProps {
  onCheckout?: () => void;
  deliveryData?: {
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  } | null;
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

export interface BonusesSectionProps {
  bonusesCount: number;
  useBonuses: boolean;
  onUseBonusesChange: (use: boolean) => void;
  totalPrice: number;
}

export interface CustomCartItem {
  productId: string;
  quantity: number;
  price: number;
  discountPercent: number;
  hasLoyaltyDiscount: boolean;
  addedAt: Date;
}

export interface CustomPricing {
  totalPrice: number;
  totalMaxPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  maxBonusUse: number;
  isMinimumReached: boolean;
}

export interface ExtendedCartSummaryProps extends CartSummaryProps {
  customCartItems?: CustomCartItem[];
  customPricing?: CustomPricing;
  isRepeatOrder?: boolean;
  onOrderSuccess?: () => void;
}
