import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const lastChat = await db
      .collection("learning")
      .findOne({ userId }, { sort: { createdAt: -1 } });

    if (!lastChat) {
      return NextResponse.json(
        { error: "Нет сохраненных чатов" },
        { status: 404 },
      );
    }

    const messages = await db
      .collection("messages")
      .find({ chatId: lastChat._id.toString() })
      .sort({ timestamp: 1 })
      .toArray();

    return NextResponse.json({
      id: lastChat._id.toString(),
      mode: lastChat.mode,
      title: lastChat.title,
      messages: messages.map((msg) => ({
        id: msg._id.toString(),
        role: msg.role,
        content: msg.content,
        images: msg.images,
        mode: msg.mode,
        timestamp: msg.timestamp,
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
