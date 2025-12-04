import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../utils/api-routes";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // Проверяем валидность orderId
    if (!orderId) {
      return NextResponse.json(
        { message: "Требуется ID заказа" },
        { status: 400 }
      );
    }

    const { deliveryDate, deliveryTimeSlot } = await request.json();

    // Валидация данных
    if (!deliveryDate || !deliveryTimeSlot) {
      return NextResponse.json(
        {
          message:
            "Отсутствуют обязательные поля: deliveryDate и deliveryTimeSlot",
        },
        { status: 400 }
      );
    }
    
    const db = await getDB();

    // Обновляем заказ
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          deliveryDate,
          deliveryTimeSlot,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Заказ не найден" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Время доставки успешно обновлено",
      data: {
        deliveryDate,
        deliveryTimeSlot,
      },
    });
  } catch (error) {
    console.error("Ошибка обновления времени доставки:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}