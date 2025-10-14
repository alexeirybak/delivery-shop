import { ProductCardProps } from "./product";

export interface UsePricingProps {
  availableCartItems: Array<{
    productId: string;
    quantity: number;
  }>;
  productsData: {
    [key: string]: ProductCardProps;
  };
  hasLoyaltyCard: boolean;
  bonusesCount: number;
  useBonuses: boolean;
}

export interface CalculatedItem {
  basePrice: number;
  priceWithDiscount: number;
  finalPrice: number;
  discountAmount: number;
  bonuses: number;
}