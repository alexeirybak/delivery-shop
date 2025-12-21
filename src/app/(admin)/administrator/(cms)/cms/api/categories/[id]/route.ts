import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../../utils/api-routes";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDB();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Неверный ID категории" },
        { status: 400 }
      );
    }

    const category = await db
      .collection("article-category")
      .findOne({ _id: new ObjectId(id) });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Категория не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        _id: category._id.toString(),
        numericId: category.numericId,
        name: category.name,
        slug: category.slug,
        description: category.description,
        keywords: category.keywords,
        image: category.image,
        imageAlt: category.imageAlt,
        author: category.author,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (error) {
    console.error("Ошибка получения категории:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка получения категории" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDB();
    const { id } = await params;

    // Принимаем сырые данные
    const rawData = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Неверный ID категории" },
        { status: 400 }
      );
    }

    if (!rawData.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Название категории обязательно" },
        { status: 400 }
      );
    }

    if (!rawData.slug?.trim()) {
      return NextResponse.json(
        { success: false, message: "Алиас (slug) категории обязателен" },
        { status: 400 }
      );
    }

    const name = rawData.name.trim();
    const slug = rawData.slug.trim().toLowerCase();
    const categoryId = new ObjectId(id);

    // Проверка уникальности slug
    const existingCategory = await db.collection("article-category").findOne({
      slug,
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Категория с таким алиасом уже существует" },
        { status: 400 }
      );
    }

    // Преобразование keywords в массив
    const processKeywords = (keywords: unknown): string[] => {
      if (!keywords) return [];

      if (typeof keywords === "string") {
        return keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
      }

      if (Array.isArray(keywords)) {
        return keywords
          .map((k) => (typeof k === "string" ? k.trim() : String(k).trim()))
          .filter((k) => k.length > 0);
      }

      return [];
    };

    const updateFields = {
      name,
      slug,
      description: rawData.description?.trim() || "",
      keywords: processKeywords(rawData.keywords),
      updatedAt: new Date().toISOString(),
      ...(rawData.image !== undefined && { image: rawData.image }),
      ...(rawData.imageAlt !== undefined && { imageAlt: rawData.imageAlt }),
    };

    const updateFilter = {
      $set: updateFields,
    };

    const result = await db
      .collection("article-category")
      .updateOne({ _id: categoryId }, updateFilter);

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Категория не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Категория обновлена",
      categoryId: id,
    });
  } catch (error) {
    console.error("Ошибка обновления категории:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка обновления категории",
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await getDB();
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Неверный ID категории" },
        { status: 400 }
      );
    }

    const categoryId = new ObjectId(id);

    // Проверяем статьи
    const articlesCount = await db
      .collection("articles")
      .countDocuments({ category: id });

    if (articlesCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Невозможно удалить категорию. В ней ${articlesCount} статей.`,
        },
        { status: 400 }
      );
    }

    const result = await db
      .collection("article-category")
      .deleteOne({ _id: categoryId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Категория не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Категория удалена",
    });
  } catch (error) {
    console.error("Ошибка удаления категории:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка удаления категории" },
      { status: 500 }
    );
  }
}
