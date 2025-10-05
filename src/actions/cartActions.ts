"use server";

import { getDB } from "../../utils/api-routes";
import { getServerUserId } from "../../utils/serverUserId";
import { ObjectId } from "mongodb";
import { getBonusesWord } from "../../utils/bonusWord";
import { CONFIG } from "../../config/config";
import { formatPrice } from "../../utils/formatPrice";
import { CartItem } from "../../utils/cart";

export async function addToCartAction(
  productId: string,
): Promise<{ success: boolean; message: string; loyaltyPrice?: number }> {
  try {
    if (!productId) {
      return { success: false, message: "ID продукта не указан" };
    }

    const userId = await getServerUserId();

    if (!userId) {
      return { success: false, message: "Не авторизован" };
    }

    const db = await getDB();

    const user = await db.collection("user").findOne({
      _id: ObjectId.createFromHexString(userId),
    });

    if (!user) {
      return { success: false, message: "Пользователь не найден" };
    }

    const productIdNumber = parseInt(productId);

    const product = await db.collection("products").findOne({
      id: productIdNumber,
    });

    if (!product) {
      return { success: false, message: "Продукт не найден" };
    }

    const discountPercent = product.discountPercent || 0;
    const basePrice = product.basePrice || 0;

    const priceWithDiscount = Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;

    const hasLoyaltyCard = user.card && user.card !== "";

    const cartItems: CartItem[] = user.cart || [];

    const existingItem = cartItems.find(
      (item: CartItem) => item.productId === productId
    );

    if (existingItem) {
      return {
        success: false,
        message: "Товар уже в корзине. Изменить его количество можно на странице корзины",
      };
    }

    const calculatedBonuses = Math.round(priceWithDiscount * CONFIG.BONUSES_PERCENT / 100);

    let loyaltyPrice: number | undefined;
    let loyaltyDiscountApplied = false;

    if (hasLoyaltyCard) {
      const cardDiscountPercent = CONFIG.CARD_DISCOUNT_PERCENT;
      loyaltyPrice = Math.round(priceWithDiscount * (1 - cardDiscountPercent / 100) * 100) / 100;
      loyaltyDiscountApplied = true;
    }

    const newCartItem: CartItem = {
      productId,
      quantity: 1,
      addedAt: new Date(),
    };

    const newCartItems = [...cartItems, newCartItem];

    await db
      .collection("user")
      .updateOne(
        { _id: ObjectId.createFromHexString(userId) },
        { $set: { cart: newCartItems } }
      );

    let successMessage = "Товар добавлен в корзину";

    if (loyaltyDiscountApplied && loyaltyPrice) {
      const discountAmount = priceWithDiscount - loyaltyPrice;
      const cardDiscountPercent = CONFIG.CARD_DISCOUNT_PERCENT;
      successMessage += ` (скидка по карте -${cardDiscountPercent}%: -${formatPrice(discountAmount)} ₽)`;
    }

    const bonusWord = getBonusesWord(calculatedBonuses);
    successMessage += `. При покупке Вы получите ${calculatedBonuses} ${bonusWord}.`;

    const result: { success: boolean; message: string; loyaltyPrice?: number } = {
      success: true,
      message: successMessage,
    };

    if (hasLoyaltyCard && loyaltyPrice) {
      result.loyaltyPrice = loyaltyPrice;
    }

    return result;

  } catch {
    return { success: false, message: "Ошибка сервера" };
  }
}