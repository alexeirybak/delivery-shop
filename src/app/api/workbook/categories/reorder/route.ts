import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/api-routes";
import { ReorderRequestItem } from "@/app/(user-part)/user-dashboard/(workbook)/categories/types";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function PUT(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();
    const items: ReorderRequestItem[] = await request.json();

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, message: "Неверный формат данных" },
        { status: 400 },
      );
    }

    if (items.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Нет тетрадей для обновления",
      });
    }

    for (const item of items) {
      if (!item._id || typeof item.numericId !== "number") {
        return NextResponse.json(
          { success: false, message: "Неверные данные тетради" },
          { status: 400 },
        );
      }
    }

    const categoryIds = items.map((item) => new ObjectId(item._id));

    const userCategories = await db
      .collection("records-category")
      .find({
        _id: { $in: categoryIds },
        userId,
      })
      .toArray();

    if (userCategories.length !== items.length) {
      return NextResponse.json(
        {
          success: false,
          message: "Некоторые тетради не найдены или доступ запрещен",
        },
        { status: 403 },
      );
    }

    const bulkOperations = items.map((item) => ({
      updateOne: {
        filter: { _id: new ObjectId(item._id), userId },
        update: {
          $set: {
            numericId: item.numericId,
            updatedAt: new Date().toISOString(),
          },
        },
      },
    }));

    const result = await db
      .collection("records-category")
      .bulkWrite(bulkOperations);

    return NextResponse.json({
      success: true,
      message: "Порядок тетрадей обновлен",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Ошибка обновления порядка тетрадей:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json(
        { success: false, message: "Не авторизован" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Ошибка обновления порядка" },
      { status: 500 },
    );
  }
}
