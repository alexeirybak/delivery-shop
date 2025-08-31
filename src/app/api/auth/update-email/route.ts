import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  const db = await getDB();

  try {
    const { email, userId } = await request.json();

    console.log("Updating email:", email, "for user:", userId);

    if (!email || !userId) {
      return NextResponse.json(
        {
          error: "Email и userId обязательны",
        },
        { status: 400 }
      );
    }

    // Конвертируем userId в ObjectId
    let objectId;
    try {
      objectId = ObjectId.createFromHexString(userId);
    } catch {
      return NextResponse.json(
        {
          error: "Неверный формат userId",
        },
        { status: 400 }
      );
    }

    // Обновляем email в базе данных
    const result = await db.collection("user").updateOne(
      { _id: objectId }, // Используем _id вместо id
      {
        $set: {
          email: email,
        },
      }
    );

    console.log("Update result:", result);

    if (result.modifiedCount === 0) {
      const user = await db.collection("user").findOne({ _id: objectId });
      if (user && user.email === email) {
        return NextResponse.json(
          {
            error: "Email уже установлен для этого пользователя",
          },
          { status: 400 }
        );
      }
      throw new Error("Пользователь не найден или email не изменен");
    }

    return NextResponse.json({
      success: true,
      message: "Email успешно обновлен",
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