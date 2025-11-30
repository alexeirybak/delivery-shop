import { NextResponse } from "next/server";
import { getDB } from "../../../../../../../utils/api-routes";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params; // Добавляем await здесь
    const { userId } = await request.json();
    const db = await getDB();

    await db.collection("chatMessages").updateMany(
      {
        orderId,
        userId: { $ne: userId }, // Сообщения не от текущего пользователя
        isRead: false,
      },
      {
        $set: { isRead: true },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка отметки сообщений как прочитанных:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}