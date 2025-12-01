import { CartItem } from "@/types/cart";
import { CartItemWithPrice, CreateOrderRequest } from "@/types/order";
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

export const updateUserAfterPayment = async (data: {
  orderId: string;
  usedBonuses?: number;
  earnedBonuses?: number;
  purchasedProductIds?: string[];
}) => {
  try {
    const response = await fetch("/api/orders/update-after-payment", {
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

export const clearUserCart = async (): Promise<void> => {
  try {
    const response = await fetch("/api/orders/clear-cart", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Ошибка при очистке коризны");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Ошибка очистки корзины");
    }
  } catch (error) {
    console.error("Ошибка очистки корзины:", error);
    throw error;
  }
};

export const updateOrderStatus = async (
  orderId: string,
  updates: { status?: string; paymentStatus?: string }
) => {
  try {
    const response = await fetch("/api/orders/update-status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        ...updates,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Ошибка при обновлении статуса заказа"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);
    throw error;
  }
};

// Специализированные функции для обратной совместимости
export const markPaymentAsFailed = async (orderId: string) => {
  return await updateOrderStatus(orderId, {
    status: "pending",
    paymentStatus: "failed",
  });
};
