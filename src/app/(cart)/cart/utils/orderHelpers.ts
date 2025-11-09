import { CartItem } from "@/types/cart";
import {
  CartItemWithPrice,
  CreateOrderRequest,
  UpdateUserData,
} from "@/types/order";
import { ProductCardProps } from "@/types/product";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "../../../../../utils/calcPrices";
import { CONFIG } from "../../../../../config/config";

export const prepareCartItemsWithPrices = (
  cartItems: CartItem[],
  productsData: Record<string, ProductCardProps>,
  hasLoyaltyCard: boolean
): CartItemWithPrice[] => {
  return cartItems
    .map((item) => {
      const product = productsData[item.productId];

      if (!product) {
        console.warn(`Товар ${item.productId} не найден, пропускаем`);
        return null;
      }

      const priceWithDiscount = calculateFinalPrice(
        product.basePrice,
        product.discountPercent || 0
      );

      const finalPrice = hasLoyaltyCard
        ? calculatePriceByCard(priceWithDiscount, CONFIG.CARD_DISCOUNT_PERCENT)
        : priceWithDiscount;

      return {
        ...item,
        price: finalPrice,
        basePrice: product.basePrice,
        discountPercent: product.discountPercent || 0,
        hasLoyaltyDiscount: hasLoyaltyCard,
      };
    })
    .filter(Boolean) as CartItemWithPrice[];
};

export const createOrderRequest = async (orderData: CreateOrderRequest) => {
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

export const confirmOrderPayment = async (orderId: string) => {
  try {
    const response = await fetch("/api/orders/confirm-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при подтверждении оплаты");
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при подтверждении оплаты:", error);
    throw error;
  }
};
