import { NextResponse } from "next/server";
import { getServerUserId } from "../../../../../../../utils/getServerUserId";
import { getDB } from "../../../../../../../utils/api-routes";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const userId = await getServerUserId();
    const db = await getDB();

    if (!userId) {
      return NextResponse.json(false);
    }

    // Проверяем есть ли непрочитанные сообщения, кроме своих
    const hasUnread = await db.collection("chatMessages").findOne({
      orderId,
      isRead: false,
      userId: { $ne: userId } // игнорируем сообщения с таким же userId
    });

    return NextResponse.json(!!hasUnread);
  } catch (error) {
    console.error("Ошибка проверки непрочитанных сообщений:", error);
    return NextResponse.json(false);
  }
}