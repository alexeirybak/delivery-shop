"use server";

import { randomBytes } from "crypto";
import { getDB } from "../../utils/api-routes";

export interface PriceAlertFormState {
  errors?: {
    email?: string;
    general?: string;
  };
  success?: boolean;
  unsubscribeToken?: string;
}

export async function createPriceAlert(
  _prevState: PriceAlertFormState | null,
  formData: FormData
): Promise<PriceAlertFormState> {
  try {
    const db = await getDB();

    const productId = formData.get("productId") as string;
    const productTitle = formData.get("productTitle") as string;
    const email = formData.get("email") as string;
    const currentPrice = Number(formData.get("currentPrice"));

    if (!email.trim()) {
      return { errors: { email: "Email обязателен" } };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { errors: { email: "Введите корректный email" } };
    }

    const existingAlert = await db.collection("priceAlerts").findOne({
      productId,
      email,
    });

    if (existingAlert) {
      return {
        errors: { email: "Вы уже подписаны на уведомления для этого товара" },
      };
    }

    const unsubscribeToken = randomBytes(32).toString("hex");

    await db.collection("priceAlerts").insertOne({
      email,
      productId,
      productTitle,
      currentPrice,
      unsubscribeToken,
      createdAt: new Date(),
    });

    return { success: true, unsubscribeToken };
  } catch (error) {
    console.error("Ошибка создания подписки:", error);
    return { errors: { general: "Ошибка оформления подписки" } };
  }
}

export async function unsubscribePriceAlert(
  token: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const db = await getDB();

    const result = await db.collection("priceAlerts").deleteOne({
      unsubscribeToken: token,
    });

    if (result.deletedCount === 0) {
      return { error: "Подписка не найдена" };
    }

    return { success: true };
  } catch (error) {
    console.error("Ошибка отписки:", error);
    return { error: "Ошибка отмены подписки" };
  }
}
