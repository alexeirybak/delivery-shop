import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { getServerUserId } from "../../../../../utils/getServerUserId";

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const userId = await getServerUserId();
    const { orderId, message, userName, userRole } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Пользователь не авторизован" },
        { status: 401 }
      );
    }

    const chatMessage = {
      orderId,
      userId,
      userName,
      message,
      timestamp: new Date(),
      readBy: [userId],
      userRole,
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
