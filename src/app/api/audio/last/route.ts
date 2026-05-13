import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const result = await db
      .collection("audio")
      .aggregate([
        { $match: { userId } },
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: "messages",
            localField: "_id",
            foreignField: "chatId",
            as: "messages",
            pipeline: [
              { $sort: { timestamp: 1 } },
              {
                $project: {
                  id: { $toString: "$_id" },
                  role: 1,
                  content: 1,
                  images: 1,
                  mode: 1,
                  timestamp: 1,
                  _id: 0,
                },
              },
            ],
          },
        },
        {
          $project: {
            id: { $toString: "$_id" },
            mode: 1,
            title: 1,
            messages: 1,
            _id: 0,
          },
        },
      ])
      .toArray();

    if (!result.length) {
      return NextResponse.json(
        { error: "Нет сохраненных чатов" },
        { status: 404 },
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Ошибка загрузки последнего чата:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
