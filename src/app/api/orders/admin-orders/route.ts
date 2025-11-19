import { getDB } from "../../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDB();
    
    // Получаем даты: месяц назад и 3 дня вперед
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const threeDaysForward = new Date(today);
    threeDaysForward.setDate(threeDaysForward.getDate() + 3);

    // Форматируем даты в строки YYYY-MM-DD
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    
    const oneMonthAgoStr = formatDate(oneMonthAgo);
    const threeDaysForwardStr = formatDate(threeDaysForward);

    // Получаем заказы за период от месяца назад до 3 дней вперед
    const orders = await db
      .collection("orders")
      .find({
        deliveryDate: {
          $gte: oneMonthAgoStr,
          $lte: threeDaysForwardStr
        }
      })
      .sort({ deliveryDate: -1, deliveryTimeSlot: 1 }) // Сначала новые даты
      .toArray();

    // Статистика - заказы за последние 3 дня (включая сегодня)
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const threeDaysAgoStr = formatDate(threeDaysAgo);

    const lastThreeDaysOrders = orders.filter(order => 
      order.deliveryDate >= threeDaysAgoStr && order.deliveryDate <= formatDate(today)
    ).length;

    const stats = {
      lastThreeDaysOrders
    };

    return NextResponse.json({ orders, stats });
  } catch (error) {
    console.error("Ошибка при загрузке заказов:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке заказов" },
      { status: 500 }
    );
  }
}

// POST метод для обновления статуса заказа
export async function POST(request: Request) {
  try {
    const { orderId, status } = await request.json();
    
    if (!orderId || !status) {
      return NextResponse.json(
        { message: "orderId и status обязательны" },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    // Обновляем статус заказа
    const result = await db.collection("orders").updateOne(
      { _id: ObjectId.createFromHexString(orderId) },
      { $set: { status: status } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Заказ не найден или статус не изменился" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Статус заказа обновлен" 
    });
  } catch (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);
    return NextResponse.json(
      { message: "Ошибка при обновлении статуса заказа" },
      { status: 500 }
    );
  }
}