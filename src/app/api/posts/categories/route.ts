import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";

// GET все категории
export async function GET() {
  try {
    const db = await getDB();
    
    const categories = await db.collection("categories")
      .find({ status: { $ne: "deleted" } }) // Исключаем удаленные
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Ошибка загрузки категорий:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка загрузки категорий" },
      { status: 500 }
    );
  }
}

// POST создание новой категории
export async function POST(request: Request) {
  try {
    const db = await getDB();
    const body = await request.json();
    
    const { name, slug } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Название категории обязательно" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли уже такая категория
    const existingCategory = await db.collection("categories").findOne({
      $or: [
        { name: name.trim() },
        { slug: slug || name.trim().toLowerCase().replace(/\s+/g, "-") }
      ]
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Категория с таким названием уже существует" },
        { status: 400 }
      );
    }

    const categorySlug = slug || name.trim().toLowerCase().replace(/\s+/g, "-");
    
    const newCategory = {
      name: name.trim(),
      slug: categorySlug,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("categories").insertOne(newCategory);

    return NextResponse.json({
      success: true,
      message: "Категория создана",
      data: {
        _id: result.insertedId,
        ...newCategory
      }
    });
  } catch (error) {
    console.error("Ошибка создания категории:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка создания категории" },
      { status: 500 }
    );
  }
}