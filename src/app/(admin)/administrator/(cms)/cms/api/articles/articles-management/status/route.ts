import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../../../utils/api-routes";

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Не указаны ID или статус" },
        { status: 400 },
      );
    }

    const validStatuses = ["published", "draft", "archived", "deleted"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Некорректный статус" },
        { status: 400 },
      );
    }

    const db = await getDB();
    const objectId = ObjectId.createFromHexString(id);

    const result = await db
      .collection("articles")
      .updateOne(
        { _id: objectId },
        { $set: { status, updatedAt: new Date() } },
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Статья не найдена" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Статус обновлен",
    });
  } catch (error) {
    console.error("Ошибка изменения статуса:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сервера" },
      { status: 500 },
    );
  }
}