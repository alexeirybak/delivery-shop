import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/api-routes";

export async function PUT(request: Request) {
  try {
    const db = await getDB();
    const items = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Неверный формат данных" },
        { status: 400 },
      );
    }

    for (const item of items) {
      if (!item._id || typeof item.numericId !== "number") {
        return NextResponse.json(
          { success: false, message: "Неверные данные записи" },
          { status: 400 },
        );
      }
    }

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
      const result = await db.collection("records").bulkWrite(bulkOperations);

      return NextResponse.json({
        success: true,
        message: "Порядок записей обновлен",
        modifiedCount: result.modifiedCount,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Нет записей для обновления",
    });
  } catch (error) {
    console.error("Ошибка обновления порядка записей:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка обновления порядка" },
      { status: 500 },
    );
  }
}
