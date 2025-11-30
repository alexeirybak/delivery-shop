import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { getServerUserId } from "../../../../../utils/getServerUserId";

// app/api/admin/chat/route.ts
export async function POST(request: Request) {
  try {
    const db = await getDB();
    const userId = await getServerUserId();
    const {
      orderId,
      message,
      userName,
      userRole = "admin",
    } = await request.json(); // убираем isAdmin

    if (!userId) {
      return NextResponse.json(
        { message: "Пользователь не авторизован" },
        { status: 401 }
      );
    }

    const chatMessage = {
      orderId,
      userId,
      userName: userName || "Администратор",
      message,
      timestamp: new Date(),
      isRead: false,
      userRole, // сохраняем только роль
    };

    const result = await db.collection("chatMessages").insertOne(chatMessage);

    return NextResponse.json({
      ...chatMessage,
      _id: result.insertedId,
    });
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
