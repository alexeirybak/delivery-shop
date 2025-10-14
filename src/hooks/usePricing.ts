"use client";

import { useEffect, useMemo } from "react";
import {
  calculateFinalPrice,
  calculatePriceByCard,
} from "../../utils/calcPrices";
import { CONFIG } from "../../config/config";
import { useCartStore } from "../store/cartStore";
import { CalculatedItem, UsePricingProps } from "@/types/pricingProps";

export const usePricing = ({
  availableCartItems,
  productsData,
  hasLoyaltyCard,
  bonusesCount,
  useBonuses,
}: UsePricingProps) => {

  const { updatePricing } = useCartStore();

  // Вычисляем все данные для каждого товара один раз
  const calculatedItems = useMemo(() => {
    return availableCartItems.map(item => {
      const product = productsData[item.productId];
      if (!product) return null;

      const priceWithDiscount = calculateFinalPrice(
        product.basePrice,
        product.discountPercent || 0
      );

      const finalPrice = hasLoyaltyCard
        ? calculatePriceByCard(priceWithDiscount, CONFIG.CARD_DISCOUNT_PERCENT)
        : priceWithDiscount;

      const discountAmount = priceWithDiscount - finalPrice;
      const bonuses = priceWithDiscount * (CONFIG.BONUSES_PERCENT / 100);

      return {
        basePrice: product.basePrice,
        priceWithDiscount,
        finalPrice,
        discountAmount,
        bonuses,
        quantity: item.quantity
      };
    }).filter(Boolean) as (CalculatedItem & { quantity: number })[];
  }, [availableCartItems, productsData, hasLoyaltyCard]);

  // Вычисляем итоговые суммы на основе подготовленных данных
  const {
    totalPrice,
    totalMaxPrice,
    totalDiscount,
    totalBonusesValue
  } = useMemo(() => {
    return calculatedItems.reduce((acc, item) => {
      const quantity = item.quantity;
      
      return {
        totalPrice: acc.totalPrice + item.finalPrice * quantity,
        totalMaxPrice: acc.totalMaxPrice + item.priceWithDiscount * quantity,
        totalDiscount: acc.totalDiscount + item.discountAmount * quantity,
        totalBonusesValue: acc.totalBonusesValue + Math.round(item.bonuses) * quantity
      };
    }, {
      totalPrice: 0,
      totalMaxPrice: 0,
      totalDiscount: 0,
      totalBonusesValue: 0
    });
  }, [calculatedItems]);

  const maxBonusUse = Math.min(
    bonusesCount,
    Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100)
  );

  const finalPrice = useBonuses
    ? Math.max(0, totalPrice - maxBonusUse)
    : totalPrice;

  const isMinimumReached = finalPrice >= 1000;

  useEffect(() => {
    updatePricing({
      totalPrice,
      totalMaxPrice,
      totalDiscount,
      finalPrice,
      maxBonusUse,
      totalBonuses: totalBonusesValue,
      isMinimumReached,
    });
  }, [
    totalPrice,
    totalMaxPrice,
    totalDiscount,
    finalPrice,
    maxBonusUse,
    totalBonusesValue,
    isMinimumReached,
    updatePricing,
  ]);

  return {
    totalPrice,
    totalMaxPrice,
    totalDiscount,
    finalPrice,
    maxBonusUse,
    totalBonuses: totalBonusesValue,
    isMinimumReached,
  };
};