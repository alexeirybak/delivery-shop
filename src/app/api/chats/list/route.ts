import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { collections } from "../../utils/collections";
import { ObjectId } from "mongodb";

interface ChatDocument {
  _id: ObjectId;
  userId: string;
  title?: string;
  mode?: string;
  createdAt?: Date;
  updatedAt?: Date;
  [key: string]: unknown;
}

interface ChatWithSource extends ChatDocument {
  sourceCollection: string;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const searchQuery = searchParams.get("search") || "";
    const typeFilter = searchParams.get("type") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const skip = (page - 1) * limit;

    const allChatsForTotal: ChatWithSource[] = [];

    for (const collectionName of collections) {
      const chats = await db
        .collection<ChatDocument>(collectionName)
        .find({ userId })
        .toArray();

      allChatsForTotal.push(
        ...chats.map((chat) => ({
          ...chat,
          sourceCollection: collectionName,
        })),
      );
    }

    const totalMaterialsInDB = allChatsForTotal.length;

    const activeDaysSet = new Set<string>();
    for (const chat of allChatsForTotal) {
      if (chat.createdAt) {
        activeDaysSet.add(chat.createdAt.toISOString().split("T")[0]);
      }
    }
    const activeDays = activeDaysSet.size;

    const uniqueTypes = new Set(
      allChatsForTotal.map((chat) => chat.sourceCollection).filter(Boolean),
    );
    const uniqueTypesCount = uniqueTypes.size;

    let filteredChats = allChatsForTotal;

    if (searchQuery) {
      filteredChats = filteredChats.filter((chat) =>
        chat.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (typeFilter !== "all") {
      filteredChats = filteredChats.filter(
        (chat) => chat.sourceCollection === typeFilter,
      );
    }

    const favorites = await db
      .collection("favorites")
      .find({ userId })
      .toArray();
    const favoritesSet = new Set(favorites.map((f) => f.materialId));
    const favoritesCount = favorites.length;

    const chatsWithInfo = await Promise.all(
      filteredChats.map(async (chat) => {
        const chatId = chat._id.toString();

        const messagesCount = await db
          .collection("messages")
          .countDocuments({ chatId });

        const lastMessage = await db
          .collection("messages")
          .findOne({ chatId }, { sort: { timestamp: -1 } });

        return {
          id: chatId,
          title: chat.title || "Без названия",
          mode: chat.mode || "unknown",
          sourceCollection: chat.sourceCollection,
          createdAt: chat.createdAt || new Date(),
          updatedAt: chat.updatedAt || new Date(),
          messagesCount: messagesCount,
          lastMessage: lastMessage?.content?.slice(0, 50) || "",
          isFavorite: favoritesSet.has(chatId),
        };
      }),
    );

    chatsWithInfo.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "createdAt":
          comparison =
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case "updatedAt":
          comparison =
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "messages":
          comparison = (b.messagesCount || 0) - (a.messagesCount || 0);
          break;
        case "favorite":
          comparison = (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === "desc" ? comparison : -comparison;
    });

    const totalFiltered = chatsWithInfo.length;
    const paginatedChats = chatsWithInfo.slice(skip, skip + limit);

    return NextResponse.json({
      items: paginatedChats,
      total: totalFiltered,
      totalMaterialsInDB,
      activeDays,
      uniqueTypesCount,
      favoritesCount,
      page,
      totalPages: Math.ceil(totalFiltered / limit),
    });
  } catch (error) {
    console.error("Ошибка загрузки чатов:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
