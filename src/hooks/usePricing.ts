"use client";

import { useCallback } from "react";
import { ProductCardProps } from "@/types/product";
import { calculateFinalPrice, calculatePriceByCard } from "../../utils/calcPrices";
import { CONFIG } from "../../config/config";


interface UsePricingProps {
  availableCartItems: Array<{
    productId: string;
    quantity: number;
  }>;
  productsData: {
    [key: string]: ProductCardProps;
  };
  hasLoyaltyCard: boolean;
  bonusesCount: number;
  useBonuses: boolean;
}

export const usePricing = ({
  availableCartItems,
  productsData,
  hasLoyaltyCard,
  bonusesCount,
  useBonuses,
}: UsePricingProps) => {
  // Расчет общей стоимости ВСЕХ товаров в корзине
  const totalPrice = availableCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total;

    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );

    const finalPrice = hasLoyaltyCard
      ? calculatePriceByCard(priceWithDiscount, CONFIG.CARD_DISCOUNT_PERCENT)
      : priceWithDiscount;

    return total + finalPrice * item.quantity;
  }, 0);

  const totalMaxPrice = availableCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total;

    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );

    return total + priceWithDiscount * item.quantity;
  }, 0);

  const totalDiscount = availableCartItems.reduce((total, item) => {
    const product = productsData[item.productId];
    if (!product) return total;

    const priceWithDiscount = calculateFinalPrice(
      product.basePrice,
      product.discountPercent || 0
    );

    const finalPrice = hasLoyaltyCard
      ? calculatePriceByCard(priceWithDiscount, CONFIG.CARD_DISCOUNT_PERCENT)
      : priceWithDiscount;

    const itemDiscount = (priceWithDiscount - finalPrice) * item.quantity;

    return total + itemDiscount;
  }, 0);

  const maxBonusUse = Math.min(
    bonusesCount,
    Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100)
  );

  const finalPrice = useBonuses
    ? Math.max(0, totalPrice - maxBonusUse)
    : totalPrice;


  const totalBonuses = useCallback(() => {
    return availableCartItems.reduce((total, item) => {
      const product = productsData[item.productId];
      if (!product) return total;

      const priceWithDiscount = calculateFinalPrice(
        product.basePrice,
        product.discountPercent || 0
      );
      const bonuses = priceWithDiscount * (CONFIG.BONUSES_PERCENT / 100);

      return total + Math.round(bonuses) * item.quantity;
    }, 0);
  }, [availableCartItems, productsData]);

  const isMinimumReached = finalPrice >= 1000;

  return {
    totalPrice,
    totalMaxPrice,
    totalDiscount,
    finalPrice,
    maxBonusUse,
    totalBonuses: totalBonuses(),
    isMinimumReached,
  };
};