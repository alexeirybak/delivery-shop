import { NextResponse } from "next/server";
import { getDB } from "../../../../../../../../utils/api-routes";

interface Article {
  category: string;
  authorName: string;
  status: string;
}

// GET - Получение всех фильтров
export async function GET(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);

    // Опциональные параметры для фильтрации
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const author = searchParams.get("author") || undefined;

    // Построение базового фильтра
    type FilterQuery = {
      title?: { $regex: string; $options: string };
      category?: string;
      status?: string;
      authorName?: string;
    };

    const filter: FilterQuery = {};

    if (search && search.trim() !== "") {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (status && status !== "all") {
      filter.status = status;
    }

    if (author && author !== "all") {
      filter.authorName = author;
    }

    // Получение уникальных категорий
    const categoriesResult = await db
      .collection<Article>("articles")
      .distinct("category", filter);
    const categories = categoriesResult.filter(
      (cat): cat is string => cat !== null && cat !== undefined && cat !== ""
    );

    // Получение уникальных авторов
    const authorsResult = await db
      .collection<Article>("articles")
      .distinct("authorName", filter);
    const authors = authorsResult.filter(
      (author): author is string =>
        author !== null && author !== undefined && author !== ""
    );

    // Получение уникальных статусов
    const statusesResult = await db
      .collection<Article>("articles")
      .distinct("status", filter);
    const statuses = statusesResult.filter(
      (status): status is string =>
        status !== null && status !== undefined && status !== ""
    );

    return NextResponse.json({
      success: true,
      categories,
      authors,
      statuses,
    });
  } catch (error) {
    console.error("Ошибка в API фильтров:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
