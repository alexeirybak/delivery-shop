import { ObjectId } from "mongodb";

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
  basePrice?: number;
  discountPercent?: number;
  hasLoyaltyDiscount?: boolean;
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
  paymentMethod: "cash_on_delivery" | "online";
  paymentId?: string;
}

export interface UpdateUserData {
  usedBonuses: number;
  earnedBonuses: number;
  purchasedProductIds: string[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  discountPercent?: number;
  hasLoyaltyDiscount?: boolean;
  productDetails?: {
    _id: string;
    id: number;
    img: string;
    title: string;
    description: string;
    basePrice: number;
    discountPercent: number;
    weight?: number;
    categories?: string[];
    brand?: string;
    manufacturer?: string;
  };
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "cancelled" | "delivered";
  paymentMethod: "cash_on_delivery" | "online";
  paymentStatus: "pending" | "waiting" | "paid" | "failed";
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
  gender?: string;
  birthday?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemDB {
  productId: ObjectId; 
  quantity: number;
  price: number;
  discountPercent?: number;
  hasLoyaltyDiscount?: boolean;
}

export interface OrderDB {
  _id: ObjectId;
  userId: ObjectId;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
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
  gender?: string;
  birthday?: string;
  items: OrderItemDB[];
  createdAt: Date;
  updatedAt: Date;
}


