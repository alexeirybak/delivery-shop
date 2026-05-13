import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const lastChat = await db
      .collection("scientific-articles")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    if (!lastChat.length) {
      return NextResponse.json({ error: "Чаты не найдены" }, { status: 404 });
    }

    const chat = lastChat[0];
    const chatId = chat._id.toString();

    const messages = await db
      .collection("messages")
      .find({ chatId })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json({
      id: chatId,
      title: chat.title,
      mode: chat.mode,
      articleStatus: chat.articleStatus,
      messages: messages.map((m) => ({
        id: m._id.toString(),
        role: m.role,
        content: m.content,
        mode: m.mode,
        timestamp: m.timestamp,
        meta: m.meta || undefined,
      })),
    });
  } catch (error) {
    console.error("Ошибка загрузки последнего чата:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
