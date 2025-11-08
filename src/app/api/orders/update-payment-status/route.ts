import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../utils/api-routes";

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const { orderId, paymentStatus } = await request.json();

    if (!orderId || !paymentStatus) {
      return NextResponse.json(
        { message: "ID заказа и статус обязательны" },
        { status: 400 }
      );
    }

    await db.collection("orders").updateOne(
      { _id: ObjectId.createFromHexString(orderId) },
      {
        $set: {
          paymentStatus,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Статус оплаты обновлен на ${paymentStatus}`,
    });
  } catch (error) {
    console.error("Ошибка обновления статуса оплаты:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
