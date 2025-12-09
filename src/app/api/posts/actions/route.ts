import { NextResponse } from "next/server";
import { ObjectId, Db } from "mongodb";
import { getDB } from "../../../../../utils/api-routes";

interface AdminRequestBody {
  action: "getArticles";
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  author?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface ActionRequestBody {
  action: "create" | "update" | "getArticle";
  id?: string;
  data?: Record<string, unknown>;
}

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
}

// Функция для получения следующего id на основе максимального существующего
async function getNextArticleId(db: Db): Promise<number> {
  try {
    // Находим статью с максимальным id
    const maxIdArticle = await db
      .collection<Article>("articles")
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();

    // Если есть статьи, берем максимальный id + 1, иначе начинаем с 1
    if (maxIdArticle.length > 0) {
      return maxIdArticle[0].id + 1;
    } else {
      return 1;
    }
  } catch (error) {
    console.error("Ошибка при получении следующего id:", error);
    // Если произошла ошибка, просто вернем 1
    return 1;
  }
}

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const body: AdminRequestBody | ActionRequestBody = await request.json();
    const { action } = body;

    // Обработка административных запросов
    if (action === "getArticles") {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        status,
        author,
        sortBy = "updatedAt",
        sortOrder = "desc",
      } = body as AdminRequestBody;

      // Построение фильтра
      type FilterQuery = {
        title?: { $regex: string; $options: string };
        category?: string;
        status?: string;
        authorName?: string;
      };

      const filter: FilterQuery = {};

      // Фильтр по поиску в названии
      if (search && search.trim() !== "") {
        filter.title = { $regex: search.trim(), $options: "i" };
      }

      // Фильтр по категории
      if (category && category !== "all") {
        filter.category = category;
      }

      // Фильтр по статусу
      if (status && status !== "all") {
        filter.status = status;
      }

      // Фильтр по автору
      if (author && author !== "all") {
        filter.authorName = author;
      }

      // Определение сортировки
      const sortOptions: Record<string, 1 | -1> = {};

      switch (sortBy) {
        case "createdAt":
        case "updatedAt":
        case "views":
          sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
          break;
        case "title":
        case "authorName":
          sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
          break;
        default:
          sortOptions.updatedAt = -1;
      }

      // Вычисление пагинации
      const skip = (page - 1) * limit;

      // Получение статей с пагинацией
      const articles = await db
        .collection<Article>("articles")
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray();

      // Получение общего количества статей
      const totalArticles = await db
        .collection<Article>("articles")
        .countDocuments(filter);
      const totalPages = Math.ceil(totalArticles / limit);

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

      // Преобразование статей для ответа
      const formattedArticles = articles.map((article) => ({
        ...article,
        _id: article._id.toString(),
      }));

      return NextResponse.json({
        success: true,
        data: formattedArticles,
        pagination: {
          page,
          limit,
          totalArticles,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        categories,
        authors,
        statuses,
      });
    }

    // Обработка остальных действий
    const { id, data } = body as ActionRequestBody;

    switch (action) {
      case "create": {
        if (!data) {
          return NextResponse.json(
            { success: false, message: "Данные для создания обязательны" },
            { status: 400 }
          );
        }

        // Проверяем обязательные поля
        if (!data.title || !data.slug) {
          return NextResponse.json(
            { success: false, message: "Заголовок и slug обязательны" },
            { status: 400 }
          );
        }

        // Проверяем уникальность slug
        const existingSlug = await db.collection<Article>("articles").findOne({
          slug: data.slug as string,
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
          title: data.title as string,
          slug: data.slug as string,
          authorName: (data.authorName as string) || "Автор",
          category: (data.category as string) || "general",
          status: (data.status as string) || "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          views: 0,
          likes: 0,
          ...data,
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
      }

      case "getArticle": {
        if (!id) {
          return NextResponse.json(
            { success: false, message: "ID статьи обязателен" },
            { status: 400 }
          );
        }

        // Всегда ищем по id (числовому)
        const articleId = parseInt(id);
        if (isNaN(articleId)) {
          return NextResponse.json(
            { success: false, message: "ID должен быть числом" },
            { status: 400 }
          );
        }

        const article = await db.collection<Article>("articles").findOne({
          id: articleId,
        });

        if (!article) {
          return NextResponse.json(
            { success: false, message: "Статья не найдена" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            ...article,
            _id: article._id.toString(),
          },
        });
      }

      case "update": {
        if (!id || !data) {
          return NextResponse.json(
            {
              success: false,
              message: "ID и данные для обновления обязательны",
            },
            { status: 400 }
          );
        }

        // Всегда ищем по id (числовому)
        const articleId = parseInt(id);
        if (isNaN(articleId)) {
          return NextResponse.json(
            { success: false, message: "ID должен быть числом" },
            { status: 400 }
          );
        }

        // Запрещаем обновление id статьи
        if (data.id !== undefined) {
          return NextResponse.json(
            { success: false, message: "ID статьи нельзя изменять" },
            { status: 400 }
          );
        }

        // Если обновляем slug, проверяем уникальность
        if (data.slug) {
          const existingSlug = await db
            .collection<Article>("articles")
            .findOne({
              slug: data.slug as string,
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
      }

      default:
        return NextResponse.json(
          { success: false, message: "Неизвестное действие" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Ошибка в API действий:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка";
    return NextResponse.json(
      { success: false, message: "Ошибка сервера", error: errorMessage },
      { status: 500 }
    );
  }
}
