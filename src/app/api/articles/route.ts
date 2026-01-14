import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDB();
    
    // Получаем ВСЕ опубликованные статьи с нужными полями
    const articles = await db
      .collection("articles")
      .find(
        { status: "published" }, // Только опубликованные
        {
          projection: {
            _id: 1,
            name: 1,
            slug: 1,
            description: 1,
            image: 1,
            imageAlt: 1,
            categoryName: 1,
            categorySlug: 1,
            createdAt: 1,
            publishedAt: 1,
          }
        }
      )
      .sort({ createdAt: -1 }) // Сортировка по дате создания
      .toArray();

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке статей" },
      { status: 500 }
    );
  }
}