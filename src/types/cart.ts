import { ProductCardProps } from "./product";
import { DeliveryAddress, DeliveryTime } from "./order";

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface CartSummaryProps {
  onCheckout?: () => void;
  isCheckout?: boolean;
  deliveryData?: {
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  } | null; 
  productsData?: { [key: string]: ProductCardProps };
}

export interface CartSidebarProps {
  onCheckout?: () => void;
  deliveryData?: {
    address: DeliveryAddress;
    time: DeliveryTime;
    isValid: boolean;
  } | null; 
  productsData?: { [key: string]: ProductCardProps };
}

export interface CartItemProps {
  item: {
    productId: string;
    addedAt: Date;
    quantity: number;
  };
  productData: ProductCardProps | undefined;
  isSelected: boolean;
  onSelectionChange: (productId: string, isSelected: boolean) => void;
  onQuantityUpdate: (productId: string, newQuantity: number) => void;
}