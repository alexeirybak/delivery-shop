import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";

interface FilterQuery {
  $or?: Array<{
    [key: string]: { $regex: string; $options: string };
  }>;
  category?: string;
  status?: string;
}

interface RequestBody {
  action: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const body: RequestBody = await request.json();

    const { action, ...params } = body;

    if (action === "getArticles") {
      const page = params.page || 1;
      const limit = params.limit || 10;
      const search = params.search || "";
      const category = params.category || "";
      const status = params.status || "";
      const sortBy = params.sortBy || "createdAt";
      const sortOrder = params.sortOrder || "desc";

      const skip = (page - 1) * limit;

      const query: FilterQuery = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { slug: { $regex: search, $options: "i" } },
          { authorName: { $regex: search, $options: "i" } },
        ];
      }

      if (category) {
        query.category = category;
      }

      if (status) {
        query.status = status;
      }

      // Получаем все категории для фильтра
      const categories = await db
        .collection("articles")
        .distinct("category", { category: { $ne: null } });

      // Получаем статьи
      const articles = await db
        .collection("articles")
        .find(query)
        .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .toArray();

      // Общее количество
      const total = await db.collection("articles").countDocuments(query);

      return NextResponse.json({
        success: true,
        data: articles,
        categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "Неизвестное действие" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Ошибка в админ API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    return NextResponse.json(
      { success: false, message: "Ошибка сервера", error: errorMessage },
      { status: 500 }
    );
  }
}
