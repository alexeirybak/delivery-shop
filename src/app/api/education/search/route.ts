import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { ObjectId } from "mongodb";
import { highlightText } from "@/app/api/utils/highlightText";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const { query } = await request.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: "Введите поисковый запрос" },
        { status: 400 },
      );
    }

    const db = await getDB();
    const searchRegex = new RegExp(query, "i");

    const chatsByTitle = await db
      .collection("education")
      .find({
        userId,
        title: { $regex: searchRegex },
      })
      .toArray();

    const matchedMessages = await db
      .collection("messages")
      .find({
        content: { $regex: searchRegex },
      })
      .toArray();

    const chatIdsFromMessages = [
      ...new Set(matchedMessages.map((m) => m.chatId)),
    ];

    const chatsByMessages = await db
      .collection("education")
      .find({
        userId,
        _id: {
          $in: chatIdsFromMessages
            .map((id) => {
              try {
                return new ObjectId(id);
              } catch {
                return null;
              }
            })
            .filter((id): id is ObjectId => id !== null),
        },
      })
      .toArray();

    const allChats = [...chatsByTitle, ...chatsByMessages];
    const uniqueChats = Array.from(
      new Map(allChats.map((chat) => [chat._id.toString(), chat])).values(),
    );

    const results = await Promise.all(
      uniqueChats.map(async (chat) => {
        const chatId = chat._id.toString();

        const messagesCount = await db
          .collection("messages")
          .countDocuments({ chatId });

        const lastMessage = await db
          .collection("messages")
          .findOne({ chatId }, { sort: { timestamp: -1 } });

        const matchedInChat = matchedMessages
          .filter((m) => m.chatId === chatId)
          .map((m) => ({
            id: m._id.toString(),
            content: highlightText(m.content, query),
            timestamp: m.timestamp,
          }))
          .slice(0, 3);
        return {
          id: chatId,
          title: chat.title,
          mode: chat.mode,
          messagesCount,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
          lastMessage: lastMessage?.content?.slice(0, 50) || "",
          matchedMessages: matchedInChat,
        };
      }),
    );

    results.sort((a, b) => {
      const aHasTitleMatch = a.title
        .toLowerCase()
        .includes(query.toLowerCase());
      const bHasTitleMatch = b.title
        .toLowerCase()
        .includes(query.toLowerCase());
      if (aHasTitleMatch && !bHasTitleMatch) return -1;
      if (!aHasTitleMatch && bHasTitleMatch) return 1;
      return 0;
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Ошибка поиска чатов:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
