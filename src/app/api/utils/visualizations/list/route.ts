import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const chats = await db
      .collection("visualizations")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    const chatsWithInfo = await Promise.all(
      chats.map(async (chat) => {
        const chatId = chat._id.toString();

        const messagesCount = await db
          .collection("messages")
          .countDocuments({ chatId });

        const lastMessage = await db
          .collection("messages")
          .findOne({ chatId }, { sort: { timestamp: -1 } });

        return {
          id: chatId,
          title: chat.title,
          mode: chat.mode,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
          messagesCount: messagesCount,
          lastMessage: lastMessage?.content?.slice(0, 50) || "",
        };
      }),
    );

    return NextResponse.json(chatsWithInfo);
  } catch (error) {
    console.error("Ошибка загрузки чатов:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
