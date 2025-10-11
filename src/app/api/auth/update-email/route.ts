import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  const db = await getDB();

  try {
    const { email, userId } = await request.json();

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Email и userId обязательны" },
        { status: 400 }
      );
    }

    let objectId;
    try {
      objectId = ObjectId.createFromHexString(userId);
    } catch {
      return NextResponse.json(
        { error: "Неверный формат userId" },
        { status: 400 }
      );
    }

    const existingUser = await db.collection("user").findOne({
      email: email,
      _id: { $ne: objectId }, 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    const result = await db
      .collection("user")
      .updateOne({ _id: objectId }, { $set: { email: email } });

    return NextResponse.json({
      success: true,
      message: "Email обновлен",
      modified: result.modifiedCount > 0,
    });
  } catch (error) {
    console.error("Ошибка при обновлении email:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
