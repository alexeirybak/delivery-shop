import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../utils/api-routes";

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { message: "ID заказа обязателен" },
        { status: 400 }
      );
    }

    // 1. Находим заказ
    const order = await db.collection("orders").findOne({
      _id: ObjectId.createFromHexString(orderId),
    });

    if (!order) {
      return NextResponse.json(
        { message: "Заказ не найден" },
        { status: 404 }
      );
    }

    // 2. СПИСЫВАЕМ ТОВАРЫ
    for (const item of order.items) {
      const productIdNumber = parseInt(item.productId);
      
      await db.collection("products").updateOne(
        { id: productIdNumber },
        { 
          $inc: { quantity: -item.quantity },
          $set: { updatedAt: new Date() }
        }
      );
    }

    // 3. Обновляем статус заказа
    await db.collection("orders").updateOne(
      { _id: ObjectId.createFromHexString(orderId) },
      { 
        $set: { 
          status: "confirmed",
          paymentStatus: "paid", 
          paidAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: "Оплата подтверждена и товары списаны"
    });

  } catch (error) {
    console.error("Ошибка подтверждения оплаты:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}