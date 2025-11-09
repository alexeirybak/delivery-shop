"use server";

import { getDB } from "../../utils/api-routes";
import { getServerUserId } from "../../utils/getServerUserId";
import { ObjectId } from "mongodb";
import { CartItem } from "../types/cart";

export async function addToCartAction(
  productId: string
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

    const cartItems: CartItem[] = user.cart || [];

    const existingItem = cartItems.find(
      (item: CartItem) => item.productId === productId
    );

    if (existingItem) {
      return {
        success: false,
        message: "Товар уже в корзине",
      };
    }

    const productQuantity = product.quantity || 0;

    const initialQuantity = productQuantity > 0 ? 1 : 0;

    const newCartItem: CartItem = {
      productId,
      quantity: initialQuantity,
      addedAt: new Date(),
    };

    const newCartItems = [...cartItems, newCartItem];

    await db
      .collection("user")
      .updateOne(
        { _id: ObjectId.createFromHexString(userId) },
        { $set: { cart: newCartItems } }
      );

    return {
      success: true,
      message: "",
    };
  } catch {
    return { success: false, message: "Ошибка сервера" };
  }
}
