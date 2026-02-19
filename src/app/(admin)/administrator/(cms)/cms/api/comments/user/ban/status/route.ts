import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../../../../utils/api-routes";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "ID пользователя не указан" },
        { status: 400 }
      );
    }

    const db = await getDB();

    const user = await db.collection("user").findOne(
      { _id: new ObjectId(userId) },
      { projection: { bannedUntil: 1 } }
    );

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const now = new Date();
    // Проверяем, есть ли поле bannedUntil и не истекло ли оно
    const isBanned = user.bannedUntil ? new Date(user.bannedUntil) > now : false;

    return NextResponse.json({ 
      isBanned,
      bannedUntil: user.bannedUntil || null 
    });
  } catch (error) {
    console.error("Ошибка проверки статуса бана:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}