import { NextResponse } from "next/server";
import { ObjectId, Db } from "mongodb";
import { getDB } from "../../../../../../../../utils/api-routes";

interface Article {
  _id: ObjectId;
  id: number;
  title: string;
  slug: string;
  authorName: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  content: string;
  description: string;
  image: string;
  tags: string[];
}

// Функция для получения следующего id
async function getNextArticleId(db: Db): Promise<number> {
  try {
    const maxIdArticle = await db
      .collection<Article>("articles")
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    if (maxIdArticle.length > 0 && maxIdArticle[0].id) {
      return maxIdArticle[0].id + 1;
    }

    return 1;
  } catch (error) {
    console.error("Ошибка при получении следующего id:", error);
    return 1;
  }
}

// GET - Получение статей
export async function GET(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const author = searchParams.get("author") || "";
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Фильтр
    const filter: Record<string, unknown> = {};

    if (search.trim() !== "") {
      filter.title = { $regex: search.trim(), $options: "i" };
    }

    if (category !== "" && category !== "all") {
      filter.category = category;
    }

    if (status !== "" && status !== "all") {
      filter.status = status;
    }

    if (author !== "" && author !== "all") {
      filter.authorName = author;
    }

    // Сортировка
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Пагинация
    const skip = (page - 1) * limit;

    // Получение статей
    const articles = await db
      .collection<Article>("articles")
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();

    // Общее количество
    const totalArticles = await db
      .collection<Article>("articles")
      .countDocuments(filter);
    const totalPages = Math.ceil(totalArticles / limit);

    return NextResponse.json({
      success: true,
      data: articles.map((article) => ({
        ...article,
        _id: article._id.toString(),
      })),
      pagination: {
        page,
        limit,
        totalArticles,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Ошибка в API статей:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

// POST - Создание новой статьи
export async function POST(request: Request) {
  try {
    const db = await getDB();
    const data = await request.json();

    // Проверяем обязательные поля
    if (!data.title || !data.slug) {
      return NextResponse.json(
        { success: false, message: "Заголовок и slug обязательны" },
        { status: 400 }
      );
    }

    // Проверяем уникальность slug
    const existingSlug = await db.collection<Article>("articles").findOne({
      slug: data.slug,
    });

    if (existingSlug) {
      return NextResponse.json(
        { success: false, message: "Статья с таким slug уже существует" },
        { status: 400 }
      );
    }

    // Получаем следующий id
    const nextId = await getNextArticleId(db);

    const newArticle: Article = {
      _id: new ObjectId(),
      id: nextId,
      title: data.title,
      slug: data.slug,
      authorName: data.authorName || "Автор",
      category: data.category || "Без категории",
      status: data.status || "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      content: data.content || "",
      description: data.description || "",
      image: data.image || "",
      tags: data.tags || [],
    };

    await db.collection<Article>("articles").insertOne(newArticle);

    return NextResponse.json({
      success: true,
      message: "Статья создана",
      data: {
        ...newArticle,
        _id: newArticle._id.toString(),
      },
    });
  } catch (error) {
    console.error("Ошибка создания статьи:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка создания статьи" },
      { status: 500 }
    );
  }
}

// PUT - Обновление статьи
export async function PUT(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID статьи обязателен" },
        { status: 400 }
      );
    }

    const articleId = parseInt(id);
    if (isNaN(articleId)) {
      return NextResponse.json(
        { success: false, message: "ID должен быть числом" },
        { status: 400 }
      );
    }

    if (data.id !== undefined) {
      return NextResponse.json(
        { success: false, message: "ID статьи нельзя изменять" },
        { status: 400 }
      );
    }

    if (data.slug) {
      const existingSlug = await db.collection<Article>("articles").findOne({
        slug: data.slug,
        id: { $ne: articleId },
      });

      if (existingSlug) {
        return NextResponse.json(
          { success: false, message: "Статья с таким slug уже существует" },
          { status: 400 }
        );
      }
    }

    const result = await db.collection<Article>("articles").updateOne(
      { id: articleId },
      {
        $set: {
          ...data,
          updatedAt: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Статья не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Статья обновлена",
    });
  } catch (error) {
    console.error("Ошибка обновления статьи:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка обновления статьи" },
      { status: 500 }
    );
  }
}
