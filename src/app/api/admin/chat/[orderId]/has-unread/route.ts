// app/api/admin/chat/[orderId]/has-unread/route.ts
import { NextResponse } from "next/server";
import { getDB } from "../../../../../../../utils/api-routes";
import { getServerUserId } from "../../../../../../../utils/getServerUserId";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const currentUserId = await getServerUserId(); // ID того, кто сейчас за компьютером
    const db = await getDB();

    if (!currentUserId) {
      return NextResponse.json(false);
    }

    // Простая проверка: есть ли хоть одно сообщение, которое текущий пользователь не читал
    const hasUnread = await db.collection("chatMessages").findOne({
      orderId,
      readBy: { $ne: currentUserId } // текущий пользователь НЕ в списке прочитавших
    });

    return NextResponse.json(!!hasUnread);
  } catch (error) {
    console.error("Ошибка проверки непрочитанных сообщений:", error);
    return NextResponse.json(false);
  }
}