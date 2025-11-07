import { useState, useEffect, useCallback } from "react";
import { Order } from "@/types/order";
import { CurrentProduct, PriceComparison } from "@/types/userOrder";
import { CONFIG } from "../../config/config";

export const usePriceComparison = (order: Order) => {
  const [currentProducts, setCurrentProducts] = useState<CurrentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceComparison, setPriceComparison] = useState<PriceComparison | null>(null);

  const comparePrices = useCallback((currentProducts: CurrentProduct[]): void => {
    const changedItems: PriceComparison["changedItems"] = [];
    let hasAnyChanges = false;

    order.items.forEach((orderItem) => {
      const currentProduct = currentProducts.find((p) => p.id === orderItem.productId);

      if (currentProduct) {
        const priceChanged = Math.abs(orderItem.price - currentProduct.price) > 0.01;
        const discountChanged = (orderItem.discountPercent || 0) !== (currentProduct.discountPercent || 0);

        if (priceChanged || discountChanged) {
          changedItems.push({
            productId: orderItem.productId,
            productName: currentProduct.title,
            originalPrice: orderItem.price,
            currentPrice: currentProduct.price,
            quantity: orderItem.quantity,
            priceChanged,
            discountChanged,
            loyaltyStatusChanged: false,
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
    const currentTotalWithoutLoyalty = currentProducts.reduce((sum, product) => {
      const orderItem = order.items.find((item) => item.productId === product.id);
      return orderItem ? sum + product.price * orderItem.quantity : sum;
    }, 0);

    const hasLoyaltyInOrder = order.items.some((item) => item.hasLoyaltyDiscount);
    const currentTotal = hasLoyaltyInOrder
      ? currentTotalWithoutLoyalty * (1 - CONFIG.CARD_DISCOUNT_PERCENT / 100)
      : currentTotalWithoutLoyalty;

    const difference = currentTotal - originalTotal;
    const hasChanges = hasAnyChanges || Math.abs(difference) > 0.01;

    setPriceComparison({
      hasChanges,
      originalTotal,
      currentTotal,
      difference,
      changedItems,
    });
  }, [order.items, order.totalAmount]);

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      setLoading(true);

      const products = await Promise.all(
        order.items.map(async (item) => {
          const response = await fetch(`/api/products/${item.productId}`);
          const product = await response.json();

          const discountMultiplier = 1 - product.discountPercent / 100;
          const finalPrice = Math.round(product.basePrice * discountMultiplier * 100) / 100;

          return {
            id: item.productId,
            price: finalPrice,
            basePrice: product.basePrice,
            discountPercent: product.discountPercent,
            hasLoyaltyDiscount: product.hasLoyaltyDiscount,
            title: product.title,
          };
        })
      );

      setCurrentProducts(products);
      comparePrices(products);
      setLoading(false);
    };

    if (order.items.length > 0) {
      fetchCurrentPrices();
    }
  }, [comparePrices, order.items]);

  return { currentProducts, priceComparison, loading };
};