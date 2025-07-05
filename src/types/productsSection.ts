import { ProductCardProps } from "./product";

export interface ProductsSectionProps {
  title: string | React.ReactNode;  
  viewAllButton?: {
    text: string;
    href: string;
  };
  products: ProductCardProps[];
}
