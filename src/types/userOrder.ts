import { CustomCartItem, CustomPricing, DeliveryData } from "./cart";
import { Order } from "./order";

export interface ProductsData {
  [key: string]: {
    basePrice: number;
    discountPercent: number;
    hasLoyaltyDiscount: boolean;
  };
}

export interface CurrentProduct {
  id: string;
  title: string;
  price: number;
  basePrice: number;
  discountPercent?: number;
  hasLoyaltyDiscount?: boolean;
}

export interface PriceComparison {
  hasChanges: boolean;
  originalTotal: number;
  currentTotal: number;
  difference: number;
  changedItems: Array<{
    productId: string;
    productName: string;
    originalPrice: number;
    currentPrice: number;
    quantity: number;
    priceChanged: boolean;
    discountChanged: boolean;
    loyaltyStatusChanged: boolean;
    originalDiscount: number;
    currentDiscount: number;
    originalHasLoyalty: boolean;
    currentHasLoyalty: boolean;
  }>;
}

export interface RepeatOrderSectionProps {
  selectedDelivery: DeliveryData | null;
  isRepeatOrderCreated: boolean;
  canCreateRepeatOrder: boolean;
  order: Order;
  priceComparison: PriceComparison | null;
  showPriceWarning: boolean;
  onClosePriceWarning: () => void;
  deliveryData: DeliveryData | null;
  onEditDelivery: () => void;
  productsData: ProductsData;
  cartItemsForSummary: CustomCartItem[];
  customPricing: CustomPricing;
  onOrderSuccess: () => void;
}
