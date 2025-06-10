export interface ProductCardProps {
  id: number;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  rating: number;
  weight?: string;
}
