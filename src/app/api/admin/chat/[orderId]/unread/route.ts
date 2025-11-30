import { NextResponse } from "next/server";
import { getDB } from "../../../../../../../utils/api-routes";
import { getServerUserId } from "../../../../../../../utils/getServerUserId";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params; // Добавляем await здесь
    const userId = await getServerUserId();
    const db = await getDB();

    if (!userId) {
      return NextResponse.json(
        { message: "Пользователь не авторизован" },
        { status: 401 }
      );
    }

    const unreadCount = await db.collection("chatMessages").countDocuments({
      orderId,
      userId: { $ne: userId }, // Сообщения не от текущего пользователя
      isRead: false,
    });

    return NextResponse.json(unreadCount);
  } catch (error) {
    console.error("Ошибка получения непрочитанных сообщений:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}