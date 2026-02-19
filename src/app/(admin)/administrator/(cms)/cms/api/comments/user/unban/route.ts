import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../../../utils/api-routes";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "ID пользователя не указан" },
        { status: 400 }
      );
    }

    const db = await getDB();

    const result = await db.collection("user").updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      {
        $unset: {
          bannedUntil: "",
          bannedAt: "",
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Пользователь разблокирован"
    });
  } catch (error) {
    console.error("Ошибка разблокировки пользователя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}