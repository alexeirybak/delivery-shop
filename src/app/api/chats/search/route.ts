import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { ObjectId } from "mongodb";
import { highlightText } from "@/app/api/utils/highlightText";
import { collections } from "../../utils/collections";

interface ChatDocument {
  _id: ObjectId;
  userId: string;
  title?: string;
  mode?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

interface MessageDocument {
  _id: ObjectId;
  chatId: string;
  content: string;
  timestamp: Date;
  [key: string]: unknown;
}

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

    const allChats: ChatDocument[] = [];

    for (const collectionName of collections) {
      const chats = await db
        .collection<ChatDocument>(collectionName)
        .find({ userId })
        .toArray();

      allChats.push(...chats);
    }

    const chatsByTitle = allChats.filter((chat) =>
      chat.title?.toLowerCase().includes(query.toLowerCase()),
    );

    const matchedMessages = await db
      .collection<MessageDocument>("messages")
      .find({
        content: { $regex: searchRegex },
      })
      .toArray();

    const chatIdsFromMessages = [
      ...new Set(matchedMessages.map((m) => m.chatId)),
    ];

    const chatsByMessages = allChats.filter((chat) =>
      chatIdsFromMessages.includes(chat._id.toString()),
    );

    const uniqueChatsMap = new Map<string, ChatDocument>();
    [...chatsByTitle, ...chatsByMessages].forEach((chat) => {
      uniqueChatsMap.set(chat._id.toString(), chat);
    });
    const uniqueChats = Array.from(uniqueChatsMap.values());

    const results = await Promise.all(
      uniqueChats.map(async (chat) => {
        const chatId = chat._id.toString();

        const messagesCount = await db
          .collection<MessageDocument>("messages")
          .countDocuments({ chatId });

        const lastMessage = await db
          .collection<MessageDocument>("messages")
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
          title: chat.title || "Без названия",
          mode: chat.mode || "unknown",
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
