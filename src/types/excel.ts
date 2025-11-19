import { ProductRating } from "./product";

export interface ProductDetails {
  _id?: string;
  id: string;
  title?: string;
  description?: string;
  article?: string;
  brand?: string;
  manufacturer?: string;
  categories?: string[];
  weight?: number;
  quantity?: number;
  basePrice?: number;
  discountPercent?: number;
  rating?: ProductRating;
}

export interface OrderItemWithDetails {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  discountPercent?: number;
  hasLoyaltyDiscount?: boolean;
  totalPrice?: number;
  productDetails?: ProductDetails | null;
}

export interface UserData {
  _id: string;
  name: string;
  surname?: string;
  email: string;
  phoneNumber: string;
  gender?: string;
  birthdayDate?: string;
  card?: string;
  bonusesCount?: number;
  location?: string;
  region?: string;
  createdAt?: string;
  updatedAt?: string;
  favorites?: string[];
  purchases?: string[];
}

export interface OrderData {
  _id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  discountAmount?: number;
  usedBonuses?: number;
  earnedBonuses?: number;
  userId?: string;
  deliveryAddress?: {
    city?: string;
    street?: string;
    house?: string;
    apartment?: string;
    additional?: string;
  };
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  surname?: string;
  name: string;
  phone: string;
  gender?: string;
  birthday?: string;
  items: OrderItemWithDetails[];
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
}

export interface ExcelExportData {
  order: OrderData;
  user?: UserData | null;
  productsDetails: OrderItemWithDetails[];
}