import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();
    const { id } = await params;

    const rawData = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Неверный ID тетради" },
        { status: 400 },
      );
    }

    if (!rawData.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Название тетради обязательно" },
        { status: 400 },
      );
    }

    const name = rawData.name.trim();
    const categoryId = new ObjectId(id);

    const existingCategory = await db.collection("records-category").findOne({
      userId,
      name,
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Тетрадь с таким именем уже существует" },
        { status: 400 },
      );
    }

    const updateFields = {
      name,
      updatedAt: new Date().toISOString(),

      ...(rawData.description !== undefined && {
        description: rawData.description.trim(),
      }),
      ...(rawData.image !== undefined && {
        image: rawData.image,
      }),
    };

    const updateFilter = {
      $set: updateFields,
    };

    const result = await db
      .collection("records-category")
      .updateOne({ _id: categoryId, userId }, updateFilter);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Тетрадь не найдена или доступ запрещен" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Тетрадь обновлена",
      categoryId: id,
    });
  } catch (error) {
    console.error("Ошибка обновления тетради:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json(
        { success: false, message: "Не авторизован" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Ошибка обновления тетради",
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Неверный ID тетради" },
        { status: 400 },
      );
    }

    const categoryId = new ObjectId(id);

    const category = await db
      .collection("records-category")
      .findOne({ _id: categoryId, userId });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Тетрадь не найдена" },
        { status: 404 },
      );
    }

    const recordsCount = await db
      .collection("records")
      .countDocuments({ categoryId: id, userId });

    if (recordsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Невозможно удалить тетрадь. В ней записей: ${recordsCount}`,
        },
        { status: 400 },
      );
    }

    if (category.image) {
      try {
        const response = await fetch(category.image, { method: "DELETE" });
        await response.json();
      } catch (err) {
        console.error("Ошибка удаления изображения:", err);
      }
    }

    const result = await db
      .collection("records-category")
      .deleteOne({ _id: categoryId, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Тетрадь не найдена" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Тетрадь удалена",
    });
  } catch (error) {
    console.error("Ошибка удаления тетради:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json(
        { success: false, message: "Не авторизован" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Ошибка удаления тетради" },
      { status: 500 },
    );
  }
}
