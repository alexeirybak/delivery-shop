import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/api-routes";
import { sanitizeRecordHTML } from "@/app/(user-part)/user-dashboard/(workbook)/records/utils/sanitizeRecordHTML";
import { processRecordImages } from "@/app/(user-part)/user-dashboard/(workbook)/records/utils/processRecordImages";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { getFormattedDateForRecord } from "../../utils/getFormattedDateForRecord";

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const data = await request.json();

    let name = data.name?.trim();

    if (!name) {
      name = getFormattedDateForRecord();
    }

    let categoryId = data.categoryId?.trim();
    let categoryName = data.categoryName?.trim();

    const isNewRecord = !data._id || !data._id.trim();

    if (!categoryId && isNewRecord) {
      const db = await getDB();

      const collections = await db
        .listCollections({ name: "records-category" })
        .toArray();
      if (collections.length === 0) {
        await db.createCollection("records-category");
      }

      let defaultCategory = await db.collection("records-category").findOne({
        name: "Без тетради",
        userId: userId,
      });

      if (!defaultCategory) {
        const result = await db
          .collection("records-category")
          .aggregate([
            { $match: { userId: userId } },
            { $group: { _id: null, maxNumericId: { $max: "$numericId" } } },
          ])
          .toArray();

        const maxNumericId = result[0]?.maxNumericId ?? 0;
        const newNumericId = maxNumericId + 1;

        const newCategory = {
          _id: new ObjectId(),
          name: "Без тетради",
          description: "Автоматическая тетрадь для записей без тетради",
          numericId: newNumericId,
          userId: userId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await db.collection("records-category").insertOne(newCategory);
        defaultCategory = newCategory;
      }

      categoryId = defaultCategory._id.toString();
      categoryName = defaultCategory.name;
    } else if (categoryId) {
      const db = await getDB();
      const categoryExists = await db.collection("records-category").findOne({
        _id: ObjectId.createFromHexString(categoryId),
        userId: userId,
      });

      if (!categoryExists) {
        return NextResponse.json(
          { success: false, message: "Указанная тетрадь не найдена" },
          { status: 400 },
        );
      }
    }

    const description = data.description?.trim() || "";
    const image = data.image || "";
    const isFeatured = data.isFeatured || false;

    const db = await getDB();

    const sanitizedContent = sanitizeRecordHTML(data.content || "");

    const finalContent = await processRecordImages(sanitizedContent, userId);

    if (data._id && data._id.trim()) {
      try {
        const objectId = ObjectId.createFromHexString(data._id);

        const existingRecord = await db.collection("records").findOne({
          _id: objectId,
          userId: userId,
        });

        if (!existingRecord) {
          return NextResponse.json(
            {
              success: false,
              message: "Запись не найдена или доступ запрещён",
            },
            { status: 404 },
          );
        }

        const updateData = {
          name,
          description,
          image,
          categoryId,
          categoryName,
          content: finalContent,
          isFeatured,
          updatedAt: new Date().toISOString(),
        };

        await db
          .collection("records")
          .updateOne({ _id: objectId }, { $set: updateData });

        return NextResponse.json(
          {
            success: true,
            message: "Запись успешно обновлена",
          },
          { status: 200 },
        );
      } catch (error) {
        console.error("Ошибка обновления записи:", error);
        return NextResponse.json(
          {
            success: false,
            message: "Ошибка обновления записи",
          },
          { status: 500 },
        );
      }
    }

    const result = await db
      .collection("records")
      .aggregate([
        {
          $match: { userId: userId },
        },
        {
          $group: {
            _id: null,
            maxNumericId: { $max: "$numericId" },
          },
        },
      ])
      .toArray();

    let maxNumericId = 0;
    if (
      result.length > 0 &&
      result[0].maxNumericId !== null &&
      result[0].maxNumericId !== undefined
    ) {
      maxNumericId = result[0].maxNumericId;
    }

    const newNumericId = maxNumericId + 1;

    const newRecord = {
      _id: new ObjectId(),
      numericId: newNumericId,
      name,
      description,
      image,
      categoryId,
      categoryName,
      content: finalContent,
      isFeatured,
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("records").insertOne(newRecord);

    const responseRecord = {
      ...newRecord,
      _id: newRecord._id.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Запись успешно создана",
        data: responseRecord,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Ошибка создания записи:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Ошибка создания записи",
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID записи не указан" },
        { status: 400 },
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Неверный формат ID" },
        { status: 400 },
      );
    }

    const db = await getDB();
    const objectId = new ObjectId(id);

    const existingRecord = await db.collection("records").findOne({
      _id: objectId,
      userId: userId,
    });

    if (!existingRecord) {
      return NextResponse.json(
        { success: false, message: "Запись не найдена или доступ запрещён" },
        { status: 404 },
      );
    }

    const result = await db.collection("records").deleteOne({
      _id: objectId,
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Не удалось удалить запись" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Запись успешно удалена",
    });
  } catch (error) {
    console.error("Ошибка удаления записи:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Ошибка удаления записи",
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 },
    );
  }
}
