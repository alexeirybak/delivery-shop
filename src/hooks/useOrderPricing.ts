import { useMemo } from "react";
import { Order } from "@/types/order";
import { CustomCartItem, CustomPricing } from "@/types/cart";
import { CurrentProduct, PriceComparison, ProductsData } from "@/types/userOrder";
import { CONFIG } from "../../config/config";

export const useOrderPricing = (
  order: Order,
  currentProducts: CurrentProduct[],
  priceComparison: PriceComparison | null
) => {
  const cartItemsForSummary: CustomCartItem[] = useMemo(
    () =>
      order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discountPercent: item.discountPercent || 0,
        hasLoyaltyDiscount: item.hasLoyaltyDiscount || false,
        addedAt: new Date(),
      })),
    [order.items]
  );

  const productsData: ProductsData = useMemo(
    () =>
      order.items.reduce((acc, item) => {
        const currentProduct = currentProducts.find(
          (p) => p.id === item.productId
        );
        const shouldUseOriginalPrice = !priceComparison?.hasChanges;

        if (shouldUseOriginalPrice) {
          acc[item.productId] = {
            basePrice: item.price / (1 - (item.discountPercent || 0) / 100),
            discountPercent: item.discountPercent || 0,
            hasLoyaltyDiscount: item.hasLoyaltyDiscount || false,
          };
        } else {
          acc[item.productId] = {
            basePrice: currentProduct?.basePrice || item.price,
            discountPercent:
              currentProduct?.discountPercent || item.discountPercent || 0,
            hasLoyaltyDiscount:
              currentProduct?.hasLoyaltyDiscount ||
              item.hasLoyaltyDiscount ||
              false,
          };
        }
        return acc;
      }, {} as ProductsData),
    [order.items, currentProducts, priceComparison]
  );

  const customPricing: CustomPricing = useMemo(() => {
    const totalWithoutDiscounts = cartItemsForSummary.reduce((sum, item) => {
      const productData = productsData[item.productId];
      return sum + (productData?.basePrice || item.price) * item.quantity;
    }, 0);

    const productDiscount = cartItemsForSummary.reduce((sum, item) => {
      const productData = productsData[item.productId];
      if (!productData) return sum;

      const basePrice = productData.basePrice;
      const discountPercent = productData.discountPercent || 0;
      const itemDiscount = basePrice * (discountPercent / 100) * item.quantity;
      return sum + itemDiscount;
    }, 0);

    const totalAfterProductDiscounts = totalWithoutDiscounts - productDiscount;
    const hasLoyaltyCard = order.items.some((item) => item.hasLoyaltyDiscount);
    const loyaltyDiscount = hasLoyaltyCard
      ? totalAfterProductDiscounts * (CONFIG.CARD_DISCOUNT_PERCENT / 100)
      : 0;
    const finalTotal = totalAfterProductDiscounts - loyaltyDiscount;
    const totalDiscount = productDiscount + loyaltyDiscount;

    return {
      totalPrice: totalWithoutDiscounts,
      totalMaxPrice: totalWithoutDiscounts,
      totalDiscount,
      finalPrice: finalTotal,
      totalBonuses: 0,
      maxBonusUse: 0,
      isMinimumReached: true,
    };
  }, [cartItemsForSummary, productsData, order.items]);

  const hasLoyaltyCard = useMemo(
    () => order.items.some((item) => item.hasLoyaltyDiscount),
    [order.items]
  );

  return { cartItemsForSummary, productsData, customPricing, hasLoyaltyCard };
};
