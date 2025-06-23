export interface ProductCardProps {
  _id: number;
  id: number;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent?: number;
  rating: {
    rate: number;
    count: number;
  };
  categories: string[];
  weight?: string;
  quantity: number;
}
