"use server";

import { randomBytes } from "crypto";
import { getDB } from "../../utils/api-routes";

interface ActionState {
  error?: string;
  success?: boolean;
  unsubscribeToken?: string;
}

export async function createPriceAlert(
  formData: FormData
): Promise<ActionState> {
  try {
    const db = await getDB();

    const productId = formData.get("productId") as string;
    const productTitle = formData.get("productTitle") as string;
    const email = formData.get("email") as string;
    const currentPrice = Number(formData.get("currentPrice"));

    const existingAlert = await db.collection("priceAlerts").findOne({
      productId,
      email,
    });

    if (existingAlert) {
      return { error: "Вы уже подписаны на уведомления для этого товара" };
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
    return { error: "Ошибка оформления подписки" };
  }
}

export async function unsubscribePriceAlert(
  token: string
): Promise<ActionState> {
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
