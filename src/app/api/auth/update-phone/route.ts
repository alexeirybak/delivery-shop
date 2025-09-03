import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  const db = await getDB();

  try {
    const { phoneNumber, userId } = await request.json();

    if (!phoneNumber || !userId) {
      return NextResponse.json(
        { error: "Телефон и userId обязательны" },
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
      phoneNumber: phoneNumber,
      _id: { $ne: objectId },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким телефоном уже существует" },
        { status: 409 }
      );
    }

    const result = await db
      .collection("user")
      .updateOne({ _id: objectId }, { $set: { phoneNumber: phoneNumber } });

    return NextResponse.json({
      success: true,
      message: "Номер телефона обновлен",
      modified: result.modifiedCount > 0,
    });
  } catch (error) {
    console.error("Ошибка при обновлении номера телефона:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Внутренняя ошибка сервера",
      },
      { status: 500 }
    );
  }
}
