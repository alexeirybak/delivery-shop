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
  discountPercent: number;
  hasLoyaltyDiscount: boolean;
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
