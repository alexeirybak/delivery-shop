"use server";

import { getDB } from "../../utils/api-routes";
import { getServerUserId } from "../../utils/serverUserId";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";

export interface OrderCartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
  hasLoyaltyDiscount: boolean;
}

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

// Получить количество бонусов пользователя
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

// Удалить товар из корзины
export async function removeOrderItemAction(
  productId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const userId = await getServerUserId();

    if (!userId) {
      return { success: false, message: "Не авторизован" };
    }

    const db = await getDB();

    // Сначала получаем пользователя
    const user = await db.collection("user").findOne({
      _id: ObjectId.createFromHexString(userId),
    });

    if (!user || !user.cart) {
      return { success: false, message: "Корзина не найдена" };
    }

    // Фильтруем корзину, удаляя нужный товар
    const updatedCart = user.cart.filter(
      (item: OrderCartItem) => item.productId !== productId
    );

    // Если корзина не изменилась, значит товара не было
    if (updatedCart.length === user.cart.length) {
      return { success: false, message: "Товар не найден в корзине" };
    }

    // Обновляем корзину (убрали неиспользуемую переменную result)
    await db.collection("user").updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      { 
        $set: { cart: updatedCart } 
      }
    );

    revalidatePath("/cart");
    return { success: true, message: "Товар удален из корзины" };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { success: false, message: "Ошибка сервера" };
  }
}

// Обновить количество товара в корзине
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

// Удалить несколько товаров из корзины
export async function removeMultipleOrderItemsAction(
  productIds: string[]
): Promise<{ success: boolean; message: string }> {
  try {
    const userId = await getServerUserId();

    if (!userId) {
      return { success: false, message: "Не авторизован" };
    }

    const db = await getDB();
    
    // Получаем текущую корзину
    const user = await db.collection("user").findOne({
      _id: ObjectId.createFromHexString(userId),
    });
    
    if (!user) {
      return { success: false, message: "Пользователь не найден" };
    }
    
    // Сохраняем исходную длину корзины
    const initialCartLength = user.cart?.length || 0;
    
    // Фильтруем корзину, удаляя указанные товары
    const updatedCart = user.cart.filter(
      (item: OrderCartItem) => !productIds.includes(item.productId)
    );
    
    // Обновляем корзину
    await db.collection("user").updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      { 
        $set: { cart: updatedCart } 
      }
    );

    const removedCount = initialCartLength - updatedCart.length;
    
    revalidatePath("/cart");
    return { 
      success: true, 
      message: `Удалено товаров: ${removedCount}` 
    };
  } catch (error) {
    console.error("Error removing multiple cart items:", error);
    return { success: false, message: "Ошибка сервера" };
  }
}

// Очистить корзину
export async function clearOrderCartAction(): Promise<{ success: boolean; message: string }> {
  try {
    const userId = await getServerUserId();

    if (!userId) {
      return { success: false, message: "Не авторизован" };
    }

    const db = await getDB();

    await db.collection("user").updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      { 
        $set: { cart: [] } 
      }
    );

    revalidatePath("/cart");
    return { success: true, message: "Корзина очищена" };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, message: "Ошибка сервера" };
  }
}