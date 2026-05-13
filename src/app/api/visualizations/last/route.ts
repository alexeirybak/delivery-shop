import { NextRequest, NextResponse } from "next/server";
import { getBetterAuthSession } from "@/lib/auth-helpers";
import { getDB } from "@/lib/api-routes";

export async function GET(request: NextRequest) {
  try {
    const session = await getBetterAuthSession(request.headers);
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const db = await getDB();

    const lastChat = await db.collection("visualizations").findOne(
      { userId: session.user.id },
      { sort: { createdAt: -1 } }
    );

    if (!lastChat) {
      return NextResponse.json({ error: "Нет сохраненных чатов" }, { status: 404 });
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
      messages: messages.map(msg => ({
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
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}