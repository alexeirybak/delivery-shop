import { ProductCardProps } from "./product";

export interface DeliveryAddress {
  city: string;
  street: string;
  house: string;
  apartment: string;
  additional: string;
}

export interface DeliveryTime {
  date: string;
  timeSlot: string;
}

export interface CartItemWithPrice {
  productId: string;
  quantity: number;
  price: number; // итоговая цена с учетом всех скидок
  basePrice?: number; // базовая цена
  discountPercent?: number; // скидка на товар
  hasLoyaltyDiscount?: boolean; // применена ли скидка по карте лояльности
}

export interface OrderData {
  deliveryAddress: DeliveryAddress;
  deliveryTime: DeliveryTime;
  cartItems: CartItemWithPrice[];
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  usedBonuses: number;
  paymentMethod: "cash_on_delivery" | "online";
}

export interface OrderCartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface CartSummaryProps {
  onCheckout: () => void;
  deliveryData?: {
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  };
  productsData: Record<string, ProductCardProps>;
}

