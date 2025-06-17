export interface ProductCardProps {
  _id?: string;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  rating: number;
  categories: string[];
  weight: string;
}
