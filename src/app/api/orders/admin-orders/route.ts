import { getDB } from "../../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDB();

    const today = new Date();

    // ФИКС: Устанавливаем время на начало дня для today (сохраняем название!)
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const oneMonthAgo = new Date(todayStart); // Используем todayStart как базовую точку
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const dayAfterTomorrow = new Date(todayStart); // Используем todayStart как базовую точку
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    // ФИКС: Форматируем даты в строки YYYY-MM-DD с учетом локального времени
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const oneMonthAgoStr = formatDate(oneMonthAgo);
    const dayAfterTomorrowStr = formatDate(dayAfterTomorrow);
    const todayStr = formatDate(todayStart); // Используем todayStart для форматирования

    // Получаем заказы за период от месяца назад до послезавтра
    const orders = await db
      .collection("orders")
      .find({
        deliveryDate: {
          $gte: oneMonthAgoStr,
          $lte: dayAfterTomorrowStr,
        },
      })
      .sort({ deliveryDate: -1, deliveryTimeSlot: 1 })
      .toArray();

    // Статистика - заказы на сегодня, завтра и послезавтра
    const nextThreeDaysOrders = orders.filter(
      (order) =>
        order.deliveryDate >= todayStr &&
        order.deliveryDate <= dayAfterTomorrowStr
    ).length;

    const stats = {
      nextThreeDaysOrders,
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
    const result = await db
      .collection("orders")
      .updateOne(
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
      message: "Статус заказа обновлен",
    });
  } catch (error) {
    console.error("Ошибка при обновлении статуса заказа:", error);
    return NextResponse.json(
      { message: "Ошибка при обновлении статуса заказа" },
      { status: 500 }
    );
  }
}
