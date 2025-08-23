import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../utils/api-routes";

export async function POST(request: Request) {
  try {
    const { userId, updates } = await request.json();
    
    console.log("Received update request:", { userId, updates });
    
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const db = await getDB();

    const objectId = ObjectId.createFromHexString(userId);

    const result = await db
      .collection("user")
      .updateOne({ _id: objectId }, { $set: updates });

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Профиль не был изменен или пользователь не найден" },
        { status: 200 } // Возвращаем 200, так как это не обязательно ошибка
      );
    }

    return NextResponse.json({
      success: true,
      message: "Профиль успешно обновлен",
    });
  } catch (error) {
    console.error("Ошибка обновления профиля:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}
