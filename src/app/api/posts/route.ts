import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";


export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const body = await request.json();

    const { 
      title, 
      slug, 
      description, 
      content, 
      authorName, 
      tags = [], 
      category, 
      isPublished = false 
    } = body;

    // Валидация обязательных полей
    if (!title || !title.trim()) {
      return NextResponse.json(
        { message: "Заголовок обязателен" },
        { status: 400 }
      );
    }

    if (!slug || !slug.trim()) {
      return NextResponse.json(
        { message: "Slug обязателен" },
        { status: 400 }
      );
    }

    // Проверка уникальности slug
    const existingArticle = await db.collection("articles").findOne({ slug });
    if (existingArticle) {
      return NextResponse.json(
        { message: "Статья с таким URL уже существует" },
        { status: 409 }
      );
    }

    // Подготовка данных для сохранения
    const articleData = {
      title: title.trim(),
      slug: slug.trim(),
      description: description?.trim() || "",
      content: content || "",
      authorName: authorName,
      tags: Array.isArray(tags) ? tags : [],
      category: category || "Без категории",
      views: 0,
      likes: 0,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: isPublished ? new Date() : null,
    };

    // Сохранение в БД
    const result = await db.collection("articles").insertOne(articleData);

    return NextResponse.json({
      success: true,
      message: isPublished ? "Статья опубликована" : "Статья сохранена как черновик",
      data: {
        id: result.insertedId,
        slug: articleData.slug,
        title: articleData.title,
      }
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("Ошибка при сохранении статьи:", error);
    return NextResponse.json(
      { 
        message: "Внутренняя ошибка сервера",
        error: process.env.NODE_ENV === "development" ? error.message : undefined 
      },
      { status: 500 }
    );
  }
}

// Получение списка статей (дополнительно)
export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const isPublished = searchParams.get("published");
    const authorId = searchParams.get("authorId");
    
    const skip = (page - 1) * limit;
    
    // Базовый запрос
    const query: unknown = {};
    
    if (isPublished !== null) {
      query.isPublished = isPublished === "true";
    }
    
    if (authorId) {
      query.authorId = authorId;
    }
    
    // Получение статей
    const articles = await db
      .collection("articles")
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Общее количество
    const total = await db.collection("articles").countDocuments(query);
    
    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    });
    
  } catch (error) {
    console.error("Ошибка при получении статей:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке статей" },
      { status: 500 }
    );
  }
}