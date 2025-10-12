// types/order.ts

export interface DeliveryAddress {
  city: string;
  street: string;
  house: string;
  apartment: string;
  additional: string;
}

export interface DeliveryTime {
  date: string;
  timeSlot: string;
}

export interface CartItemWithPrice {
  productId: string;
  quantity: number;
  price: number;
  productData?: {
    name: string;
    category: string;
  };
}

export interface OrderData {
  deliveryAddress: DeliveryAddress;
  deliveryTime: DeliveryTime;
  cartItems: CartItemWithPrice[];
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  totalBonuses: number;
  usedBonuses: number;
  paymentMethod: 'cash_on_delivery' | 'online';
}