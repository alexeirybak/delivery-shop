import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const chats = await db
      .collection("audio")
      .aggregate([
        { $match: { userId } },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "messages",
            let: { chatId: { $toString: "$_id" } },
            pipeline: [
              { $match: { $expr: { $eq: ["$chatId", "$$chatId"] } } },
              { $sort: { timestamp: -1 } },
              { $limit: 1 },
              { $project: { content: 1, _id: 0 } },
            ],
            as: "lastMessageData",
          },
        },
        {
          $addFields: {
            messagesCount: { $size: { $ifNull: ["$messages", []] } },
            lastMessage: { $arrayElemAt: ["$lastMessageData.content", 0] },
          },
        },
        {
          $project: {
            id: { $toString: "$_id" },
            title: 1,
            mode: 1,
            createdAt: 1,
            updatedAt: 1,
            messagesCount: 1,
            lastMessage: { $ifNull: ["$lastMessage", ""] },
          },
        },
      ])
      .toArray();

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Ошибка загрузки чатов:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
