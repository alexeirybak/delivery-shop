import { getDB } from "../../../../../../utils/api-routes";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDB();

    // Получаем даты: месяц назад и послезавтра (включительно)
    const today = new Date();

    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const oneMonthAgo = new Date(todayStart);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const dayAfterTomorrow = new Date(todayStart);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2); // +2 дня = послезавтра

    // Форматируем даты в строки YYYY-MM-DD
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const oneMonthAgoStr = formatDate(oneMonthAgo);
    const dayAfterTomorrowStr = formatDate(dayAfterTomorrow);
    const todayStr = formatDate(todayStart);

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
      nextThreeDaysOrders, // заказы на: сегодня + завтра + послезавтра
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
