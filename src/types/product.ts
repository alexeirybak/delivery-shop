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
  rating: ProductRating;
  tags: string[];
  weight: number;
  quantity: number;
  orderQuantity?: number;
  isLowStock?: boolean;
  insufficientStock?: boolean;
  categories: string[];
  article: string;
  brand: string;
  manufacturer: string;
  isHealthyFood: boolean;
  isNonGMO: boolean;
  isOrderPage?: boolean;
}
