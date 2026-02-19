import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../../../utils/api-routes";


export async function POST(request: NextRequest) {
  try {
    const { userId, banDays } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "ID пользователя не указан" },
        { status: 400 }
      );
    }

    const db = await getDB();

    let banUntil = null;
    if (banDays !== null) {
      banUntil = new Date();
      banUntil.setDate(banUntil.getDate() + banDays);
    }

    const result = await db.collection("user").updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          bannedUntil: banUntil,
          bannedAt: new Date(),
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
      message: banDays === null 
        ? "Пользователь забанен навсегда" 
        : `Пользователь забанен на ${banDays} дней`
    });
  } catch (error) {
    console.error("Ошибка бана пользователя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}