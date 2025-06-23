import { ProductCardProps } from "./product";

export interface ProductsSectionProps {
  title: string;
  viewAllButton: {
    text: string;
    href: string;
  };
  products: ProductCardProps[];
  compact?: boolean; // Режим компонента (3/4 товара) или страницы (все товары)
}
