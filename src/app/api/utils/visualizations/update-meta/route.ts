import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { getDB } from "@/lib/api-routes";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const { messageId, meta } = await request.json();

    const db = await getDB();

    // Проверяем, что сообщение принадлежит пользователю через chat
    const message = await db.collection("messages").findOne({
      _id: new ObjectId(messageId),
    });

    if (!message) {
      return NextResponse.json(
        { error: "Сообщение не найдено" },
        { status: 404 },
      );
    }

    // Проверяем доступ к чату
    const chat = await db.collection("chats").findOne({
      _id: new ObjectId(message.chatId),
      userId,
    });

    if (!chat) {
      return NextResponse.json({ error: "Доступ запрещен" }, { status: 403 });
    }

    const result = await db
      .collection("messages")
      .updateOne({ _id: new ObjectId(messageId) }, { $set: { meta } });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Сообщение не найдено" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка обновления meta:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
