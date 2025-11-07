export interface ProductRating {
  average: number;
  count: number;
  rate: number;
  distribution: {
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
  };
}

export interface ProductCardProps {
  _id: string;
  id: number;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  quantity: number;
  orderQuantity?: number,
  categories: string[];
  tags?: string[];
  hasLoyaltyDiscount?: boolean;
  rating?: ProductRating;
  weight?: number;
  article?: string;
  brand?: string;
  manufacturer?: string;
  isHealthyFood?: boolean;
  isNonGMO?: boolean;
  isLowStock?: boolean;
  insufficientStock?: boolean;
}