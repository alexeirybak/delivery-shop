import { CartItem } from "@/types/cart";
import { CartItemWithPrice } from "@/types/order";
import { ProductCardProps } from "@/types/product";
import { calculateFinalPrice, calculatePriceByCard } from "../../../../../utils/calcPrices";
import { CONFIG } from "../../../../../config/config";

export interface OrderRequestData {
  finalPrice: number;
  totalBonuses: number;
  usedBonuses: number;
  totalDiscount: number;
  deliveryAddress: {
    city: string;
    street: string;
    house: string;
    apartment?: string;
    additional?: string;
  };
  deliveryTime: {
    date: string;
    timeSlot: string;
  };
  cartItems: CartItemWithPrice[];
  totalPrice: number;
  paymentMethod: "cash_on_delivery" | "online";
  paymentId?: string;
}

export const prepareCartItemsWithPrices = (
  cartItems: CartItem[],
  productsData: Record<string, ProductCardProps>,
  hasLoyaltyCard: boolean
): CartItemWithPrice[] => {
  return cartItems.map((item) => {
    const product = productsData[item.productId];

    if (!product) {
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: 0,
        addedAt: item.addedAt, 
      };
    }

    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );

    const finalPrice = hasLoyaltyCard
      ? calculatePriceByCard(priceWithDiscount, CONFIG.CARD_DISCOUNT_PERCENT)
      : priceWithDiscount;

    return {
      productId: item.productId,
      quantity: item.quantity,
      price: finalPrice,
      basePrice: product.basePrice,
      discountPercent: product.discountPercent || 0,
      hasLoyaltyDiscount: hasLoyaltyCard,
      addedAt: item.addedAt,
    };
  });
};

export const createOrderRequest = async (orderData: OrderRequestData) => {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при создании заказа");
  }

  return await response.json();
};

export interface UpdateUserData {
  usedBonuses: number;
  earnedBonuses: number;
  purchasedProductIds: string[];
}

export const updateUserAfterPayment = async (data: UpdateUserData) => {
  try {
    const response = await fetch("/api/users/update-after-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка обновления пользователя");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка обновления пользователя:", error);
    throw error;
  }
};