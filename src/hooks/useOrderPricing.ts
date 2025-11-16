import { useMemo } from "react";
import { Order } from "@/types/order";
import { CustomCartItem, CustomPricing } from "@/types/cart";
import { CurrentProduct, ProductsData } from "@/types/userOrder";
import { CONFIG } from "../../config/config";

export const useOrderPricing = (
  order: Order,
  currentProducts: CurrentProduct[]
) => {
  const cartItemsForSummary: CustomCartItem[] = useMemo(
    () =>
      order.items.map((item) => {
        const currentProduct = currentProducts.find(
          (p) => p.id.toString() === item.productId.toString()
        );

        if (!currentProduct) {
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            discountPercent: item.discountPercent || 0,
            hasLoyaltyDiscount: item.hasLoyaltyDiscount || false,
            addedAt: new Date(),
          };
        }

        const priceAfterDiscount =
          currentProduct.basePrice *
          (1 - (currentProduct.discountPercent || 0) / 100);

        return {
          productId: item.productId,
          quantity: item.quantity,
          price: priceAfterDiscount,
          discountPercent: currentProduct.discountPercent || 0,
          hasLoyaltyDiscount: currentProduct.hasLoyaltyDiscount || false,
          addedAt: new Date(),
        };
      }),
    [order.items, currentProducts]
  );

  const productsPricingData: ProductsData = useMemo(
    () =>
      currentProducts.reduce((acc, product) => {
        acc[product.id] = {
          basePrice: product.basePrice,
          discountPercent: product.discountPercent || 0,
          hasLoyaltyDiscount: product.hasLoyaltyDiscount || false,
        };
        return acc;
      }, {} as ProductsData),
    [currentProducts]
  );

  const customPricing: CustomPricing = useMemo(() => {
    const totalAfterProductDiscounts = cartItemsForSummary.reduce(
      (sum, item) => {
        return sum + item.price * item.quantity;
      },
      0
    );

    const finalTotal = cartItemsForSummary.reduce((sum, item) => {
      const finalPrice = item.hasLoyaltyDiscount
        ? item.price * (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100)
        : item.price;
      return sum + finalPrice * item.quantity;
    }, 0);

    const totalDiscount = totalAfterProductDiscounts - finalTotal;

    const totalBonuses = Math.floor(finalTotal * CONFIG.BONUSES_PERCENT / 100)

    return {
      totalPrice: totalAfterProductDiscounts,
      totalMaxPrice: totalAfterProductDiscounts,
      totalDiscount,
      finalPrice: finalTotal,
      totalBonuses: totalBonuses,
      maxBonusUse: 0,
      isMinimumReached: true,
    };
  }, [cartItemsForSummary]);

  return {
    cartItemsForSummary,
    productsData: productsPricingData,
    customPricing,
  };
};
