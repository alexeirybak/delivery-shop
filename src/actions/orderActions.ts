"use server";

import { OrderCartItem } from "@/types/cart";
import { getDB } from "../../utils/api-routes";
import { getServerUserId } from "../../utils/getServerUserId";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export async function getOrderCartAction(): Promise<OrderCartItem[]> {
  try {
    const userId = await getServerUserId();

    if (!userId) {
      return [];
    }

    const db = await getDB();
    const user = await db.collection("user").findOne({
      _id: ObjectId.createFromHexString(userId),
    });

    return user?.cart || [];
  } catch (error) {
    console.error("Error getting cart:", error);
    return [];
  }
}

export async function getUserBonusesAction(): Promise<{
  bonusesCount: number;
  hasLoyaltyCard: boolean;
}> {
  try {
    const userId = await getServerUserId();

    if (!userId) {
      return { bonusesCount: 0, hasLoyaltyCard: false };
    }

    const db = await getDB();
    const user = await db.collection("user").findOne({
      _id: ObjectId.createFromHexString(userId),
    });

    const bonusesCount = user?.bonusesCount || 0;
    const hasLoyaltyCard = !!(user?.card && user.card !== "");

    return { bonusesCount, hasLoyaltyCard };
  } catch (error) {
    console.error("Error getting bonuses:", error);
    return { bonusesCount: 0, hasLoyaltyCard: false };
  }
}

export async function updateOrderItemQuantityAction(
  productId: string, 
  quantity: number
): Promise<{ success: boolean; message: string }> {
  try {
    const userId = await getServerUserId();

    if (!userId) {
      return { success: false, message: "Не авторизован" };
    }

    const db = await getDB();

    const result = await db.collection("user").updateOne(
      { 
        _id: ObjectId.createFromHexString(userId),
        "cart.productId": productId 
      },
      { 
        $set: { "cart.$.quantity": quantity } 
      }
    );

    if (result.modifiedCount === 0) {
      return { success: false, message: "Товар не найден в корзине" };
    }

    revalidatePath("/cart");
    return { success: true, message: "Количество обновлено" };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, message: "Ошибка сервера" };
  }
}

export async function removeMultipleOrderItemsAction(
  productIds: string[]
): Promise<{ success: boolean; message: string }> {
  try {
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
    
    const updatedCart = user.cart.filter(
      (item: OrderCartItem) => !productIds.includes(item.productId)
    );
    
    await db.collection("user").updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      { 
        $set: { cart: updatedCart } 
      }
    );

    revalidatePath("/cart");
    return { 
      success: true, 
      message: `Товары удалены` 
    };
  } catch (error) {
    console.error("Ошибка удаления продуктов:", error);
    return { success: false, message: "Ошибка сервера" };
  }
}
