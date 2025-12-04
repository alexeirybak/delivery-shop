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
  name: string;
  totalPrice: number;
  basePrice: number;
  title: string;
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
  };
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "cancelled" | "delivered" | "failed" | "collected" | "delivering" | "refund" | "returned";
  paymentMethod: "cash_on_delivery" | "online";
  paymentStatus: "pending" | "waiting" | "paid" | "failed";
  paymentId: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface OrderHeaderProps {
  order: Order;
  showDeliveryButton: boolean;
  onOrderClick: () => void;
  onDeliveryClick: () => void;
  disabled: boolean;
}

// СТАТУС ЗАКАЗА
// pending - заказ создан, ожидает обработки
// confirmed - заказ подтвержден и выполняется (для онлайн-оплаты после успешной оплаты, а также для оплаты при получении - после подтверждения менеджером)
// delivered - заказ доставлен и завершен
// cancelled - заказ отменен

//СТАТУС ОПЛАТЫ
//pending - ожидание обработки
// waiting - ожидание оплаты
// paid - оплачено

// Для онлайн-оплаты:
// 1. Создание: status: "pending", paymentStatus: "pending"
// 2. Переход на оплату: paymentStatus: "waiting"
// 3. Успешная оплата: status: "confirmed",
// paymentStatus: "paid"
// 4. Доставка: status: "delivered"

// Для оплаты при получении:
// 1. Создание: status: "pending", paymentStatus: "pending"
// 2. Подтверждение: status: "confirmed", paymentStatus: "waiting"
//3. Доставка и оплата: status: "delivered", paymentStatus: "paid"
