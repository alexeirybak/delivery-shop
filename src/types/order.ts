import { CartItem } from "./cart";

export interface CartItemWithPrice extends CartItem {
  price: number;
  basePrice?: number;
  discountPercent?: number;
  hasLoyaltyDiscount?: boolean;
}


export interface DeliveryAddress {
  additional: string;
  city: string;
  street: string;
  house: string;
  apartment?: string;
}

export interface DeliveryTime {
  date: string;
  timeSlot: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  discountPercent?: number;
  hasLoyaltyDiscount?: boolean;
}

export interface Order {
  _id?: string;
  userId: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cash_on_delivery' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentId?: string;
  totalAmount: number;
  discountAmount: number;
  usedBonuses: number;
  earnedBonuses: number;
  deliveryAddress: DeliveryAddress;
  deliveryDate: string;
  deliveryTimeSlot: string;
  surname: string;
  name: string;
  phone: string;
  gender: string;
  birthday: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderRequest {
  finalPrice: number;
  totalBonuses: number;
  usedBonuses: number;
  totalDiscount: number;
  deliveryAddress: DeliveryAddress;
  deliveryTime: DeliveryTime;
  cartItems: CartItemWithPrice[];
  totalPrice: number;
  paymentMethod: 'cash_on_delivery' | 'online';
  paymentId?: string;
}