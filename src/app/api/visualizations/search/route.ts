import { NextRequest, NextResponse } from "next/server";
import { getBetterAuthSession } from "@/lib/auth-helpers";
import { getDB } from "@/lib/api-routes";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const session = await getBetterAuthSession(request.headers);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { messageId, meta } = await request.json();

    if (!messageId || !meta) {
      return NextResponse.json(
        { error: "Неверные параметры" },
        { status: 400 }
      );
    }

    const db = await getDB();

    // Находим сообщение
    const message = await db.collection("messages").findOne({
      _id: new ObjectId(messageId),
    });

    if (!message) {
      return NextResponse.json({ error: "Сообщение не найдено" }, { status: 404 });
    }

    // Проверяем, что чат принадлежит пользователю
    const chat = await db.collection("visualizations").findOne({
      _id: new ObjectId(message.chatId),
      userId: session.user.id,
    });

    if (!chat) {
      return NextResponse.json(
        { error: "Доступ запрещен" },
        { status: 403 }
      );
    }

    const result = await db.collection("messages").updateOne(
      { _id: new ObjectId(messageId) },
      { $set: { meta } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Сообщение не найдено" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка обновления метаданных:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}