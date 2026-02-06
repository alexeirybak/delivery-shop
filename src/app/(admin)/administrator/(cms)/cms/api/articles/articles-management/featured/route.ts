import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../../../utils/api-routes";

export async function PATCH(request: NextRequest) {
  try {
    const { id, isFeatured } = await request.json();

    if (!id || typeof isFeatured !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Не указаны ID или значение избранности" },
        { status: 400 },
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Некорректный ID статьи" },
        { status: 400 },
      );
    }

    const db = await getDB();
    const objectId = ObjectId.createFromHexString(id);

    const result = await db
      .collection("articles")
      .updateOne(
        { _id: objectId },
        { $set: { isFeatured, updatedAt: new Date() } },
      );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Статья не найдена" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Избранность обновлена",
    });
  } catch (error) {
    console.error("Ошибка изменения избранности:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сервера" },
      { status: 500 },
    );
  }
}