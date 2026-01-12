import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../../utils/api-routes";
import { ReorderRequestItem } from "../../../categories/types";

export async function PUT(request: Request) {
  try {
    const db = await getDB();
    const items: ReorderRequestItem[] = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Неверный формат данных" },
        { status: 400 }
      );
    }

    // Валидация данных
    for (const item of items) {
      if (!item._id || typeof item.numericId !== "number") {
        return NextResponse.json(
          { success: false, message: "Неверные данные категории" },
          { status: 400 }
        );
      }
    }

    // Обновляем numericId для всех категорий
    const bulkOperations = items.map((item) => ({
      updateOne: {
        filter: { _id: new ObjectId(item._id) },
        update: {
          $set: {
            numericId: item.numericId,
            updatedAt: new Date().toISOString(),
          },
        },
      },
    }));

    if (bulkOperations.length > 0) {
      const result = await db
        .collection("article-category")
        .bulkWrite(bulkOperations);

      return NextResponse.json({
        success: true,
        message: "Порядок категорий обновлен",
        modifiedCount: result.modifiedCount,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Нет категорий для обновления",
    });
  } catch (error) {
    console.error("Ошибка обновления порядка категорий:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка обновления порядка" },
      { status: 500 }
    );
  }
}
