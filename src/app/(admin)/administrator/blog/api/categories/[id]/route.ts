import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../utils/api-routes";

interface Category {
  _id: ObjectId;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

interface Params {
  params: {
    id: string;
  };
}

// GET - Получение конкретной категории
export async function GET(request: Request, { params }: Params) {
  try {
    const db = await getDB();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Неверный ID категории" },
        { status: 400 }
      );
    }

    const category = await db
      .collection<Category>("article-category")
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
        ...category,
        _id: category._id.toString(),
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

// PUT - Обновление категории
export async function PUT(request: Request, { params }: Params) {
  try {
    const db = await getDB();
    const { id } = params;
    const data = await request.json();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Неверный ID категории" },
        { status: 400 }
      );
    }

    // Валидация
    if (!data.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Название категории обязательно" },
        { status: 400 }
      );
    }

    if (!data.slug?.trim()) {
      return NextResponse.json(
        { success: false, message: "Алиас (slug) категории обязателен" },
        { status: 400 }
      );
    }

    const name = data.name.trim();
    const slug = data.slug.trim().toLowerCase();
    const categoryId = new ObjectId(id);

    // Проверка уникальности slug (исключая текущую категорию)
    const existingCategory = await db
      .collection<Category>("article-category")
      .findOne({
        slug,
        _id: { $ne: categoryId },
      });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Категория с таким алиасом уже существует" },
        { status: 400 }
      );
    }

    const result = await db.collection<Category>("article-category").updateOne(
      { _id: categoryId },
      {
        $set: {
          name,
          slug,
          description: data.description?.trim() || "",
          keywords: data.keywords || [],
          updatedAt: new Date().toISOString(),
        },
      }
    );

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

// DELETE - Удаление категории
export async function DELETE(request: Request, { params }: Params) {
  try {
    const db = await getDB();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Неверный ID категории" },
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
      .collection<Category>("article-category")
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
