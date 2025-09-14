export interface ProductDescription {
  _id: string;
  id: number;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent?: number;
  rating?: {
    rate: number;
    count: number;
  };
  categories: string[];
  weight: number;
  quantity: number;
  tags: string[];
  isHealthyFood?: boolean;
  isNonGMO?: boolean;
  isOurProduction?: boolean;
  article: number;
}
