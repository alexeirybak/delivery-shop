import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../utils/api-routes";

interface ArticleCategory {
  _id: ObjectId;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// GET - Получение всех категорий
export async function GET() {
  try {
    const db = await getDB();
    const categories = await db
      .collection<ArticleCategory>("article-category")
      .find({})
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: categories.map((cat) => ({
        ...cat,
        _id: cat._id.toString(),
      })),
    });
  } catch (error) {
    console.error("Ошибка получения категорий:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка получения категорий" },
      { status: 500 }
    );
  }
}

// POST - Создание новой категории
export async function POST(request: Request) {
  try {
    const db = await getDB();
    const data = await request.json();

    // Проверяем обязательные поля
    if (!data.name || !data.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Название категории обязательно" },
        { status: 400 }
      );
    }

    if (!data.slug || !data.slug.trim()) {
      return NextResponse.json(
        { success: false, message: "Slug категории обязателен" },
        { status: 400 }
      );
    }

    const categoryName = data.name.trim();
    const categorySlug = data.slug.trim().toLowerCase();

    // Проверяем уникальность slug
    const existingCategory = await db
      .collection<ArticleCategory>("article-category")
      .findOne({ slug: categorySlug });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Категория с таким slug уже существует" },
        { status: 400 }
      );
    }

    const newCategory: ArticleCategory = {
      _id: new ObjectId(),
      name: categoryName,
      slug: categorySlug,
      description: data.description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db
      .collection<ArticleCategory>("article-category")
      .insertOne(newCategory);

    return NextResponse.json({
      success: true,
      message: "Категория создана",
      data: {
        ...newCategory,
        _id: newCategory._id.toString(),
      },
    });
  } catch (error) {
    console.error("Ошибка создания категории:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка создания категории" },
      { status: 500 }
    );
  }
}

// PUT - Обновление категории
export async function PUT(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID категории обязателен" },
        { status: 400 }
      );
    }

    if (!data.name || !data.name.trim()) {
      return NextResponse.json(
        { success: false, message: "Название категории обязательно" },
        { status: 400 }
      );
    }

    const categoryName = data.name.trim();
    const categoryId = new ObjectId(id);

    // Проверяем уникальность названия (исключая текущую категорию)
    const existingCategory = await db
      .collection<ArticleCategory>("article-category")
      .findOne({
        name: { $regex: new RegExp(`^${categoryName}$`, "i") },
        _id: { $ne: categoryId },
      });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Категория с таким названием уже существует",
        },
        { status: 400 }
      );
    }

    // Обновляем slug если изменилось название
    const updateData: Partial<ArticleCategory> = {
      name: categoryName,
      updatedAt: new Date().toISOString(),
    };

    if (data.name) {
      updateData.slug = categoryName
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
    }

    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    const result = await db
      .collection<ArticleCategory>("article-category")
      .updateOne({ _id: categoryId }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Категория не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Категория обновлена",
    });
  } catch (error) {
    console.error("Ошибка обновления категории:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка обновления категории" },
      { status: 500 }
    );
  }
}

// DELETE - Удаление категории (опционально)
export async function DELETE(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID категории обязателен" },
        { status: 400 }
      );
    }

    const categoryId = new ObjectId(id);

    // Проверяем, есть ли статьи в этой категории
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
      .collection<ArticleCategory>("article-category")
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
