import { useState, useEffect, useCallback, useMemo } from "react";
import { Order } from "@/types/order";
import { CurrentProduct, PriceComparison } from "@/types/userOrder";
import { CONFIG } from "../../config/config";
import { ProductCardProps } from "@/types/product";
import { useAuthStore } from "@/store/authStore";

export const usePriceComparison = (
  order: Order,
  productsData: ProductCardProps[]
) => {
  const [priceComparison, setPriceComparison] =
    useState<PriceComparison | null>(null);
  const { user } = useAuthStore();

  const hasLoyaltyCard = !!user?.card || false;

  const currentProducts = useMemo((): CurrentProduct[] => {
    if (!productsData || productsData.length === 0) {
      return [];
    }

    return order.items
      .map((item) => {
        const productData = productsData.find(
          (p) => p.id.toString() === item.productId.toString()
        );

        if (!productData) {
          return null;
        }

        const discountMultiplier = 1 - (productData.discountPercent || 0) / 100;
        let finalPrice =
          Math.round(productData.basePrice * discountMultiplier * 100) / 100;

        if (hasLoyaltyCard) {
          finalPrice = finalPrice * (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100);
        }

        const currentProduct: CurrentProduct = {
          id: item.productId,
          price: finalPrice,
          basePrice: productData.basePrice,
          discountPercent: productData.discountPercent,
          hasLoyaltyDiscount: hasLoyaltyCard,
          title: productData.title,
        };

        return currentProduct;
      })
      .filter((product): product is CurrentProduct => product !== null);
  }, [order.items, productsData, hasLoyaltyCard]);

  const comparePrices = useCallback((): void => {
    if (currentProducts.length === 0) {
      setPriceComparison(null);
      return;
    }

    const changedItems: PriceComparison["changedItems"] = [];
    let hasAnyChanges = false;
    let currentTotal = 0;

    order.items.forEach((orderItem) => {
      const currentProduct = currentProducts.find(
        (p) => p.id === orderItem.productId
      );

      if (currentProduct) {
        currentTotal += currentProduct.price * orderItem.quantity;

        const originalPriceWithoutLoyalty = orderItem.hasLoyaltyDiscount
          ? orderItem.price / (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100)
          : orderItem.price;

        const currentPriceWithoutLoyalty = currentProduct.hasLoyaltyDiscount
          ? currentProduct.price / (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100)
          : currentProduct.price;

        const priceChanged =
          Math.abs(originalPriceWithoutLoyalty - currentPriceWithoutLoyalty) >
          0.01;
        const discountChanged =
          (orderItem.discountPercent || 0) !==
          (currentProduct.discountPercent || 0);

        const loyaltyStatusChanged =
          orderItem.hasLoyaltyDiscount !== currentProduct.hasLoyaltyDiscount;

        if (priceChanged || discountChanged || loyaltyStatusChanged) {
          changedItems.push({
            productId: orderItem.productId,
            productName: currentProduct.title,
            originalPrice: orderItem.price,
            currentPrice: currentProduct.price,
            quantity: orderItem.quantity,
            priceChanged,
            discountChanged,
            loyaltyStatusChanged,
            originalDiscount: orderItem.discountPercent || 0,
            currentDiscount: currentProduct.discountPercent || 0,
            originalHasLoyalty: orderItem.hasLoyaltyDiscount || false,
            currentHasLoyalty: currentProduct.hasLoyaltyDiscount || false,
          });
          hasAnyChanges = true;
        }
      }
    });

    const originalTotal = order.totalAmount;
    const difference = currentTotal - originalTotal;

    const hasChanges = hasAnyChanges || Math.abs(difference) > 0.01;

    setPriceComparison({
      hasChanges,
      originalTotal,
      currentTotal,
      difference,
      changedItems,
    });
  }, [currentProducts, order.items, order.totalAmount]);

  useEffect(() => {
    comparePrices();
  }, [comparePrices]);

  return { currentProducts, priceComparison };
};
