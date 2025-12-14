import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../utils/api-routes";

interface Category {
  _id: ObjectId;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

// GET - Получение всех категорий
export async function GET() {
  try {
    const db = await getDB();

    const categories = await db
      .collection<Category>("article-category")
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

    // Проверка уникальности slug
    const existingCategory = await db
      .collection<Category>("article-category")
      .findOne({ slug });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Категория с таким алиасом уже существует" },
        { status: 400 }
      );
    }

    const newCategory: Category = {
      _id: new ObjectId(),
      name,
      slug,
      description: data.description?.trim() || "",
      keywords: data.keywords || [], 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection<Category>("article-category").insertOne(newCategory);

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
