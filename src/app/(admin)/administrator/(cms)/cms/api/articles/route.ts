import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../utils/api-routes";
import { processArticleImages } from "../../articles/utils/processArticleImages";
import { sanitizeArticleHTML } from "@/app/(blog)/blog/articles/[id]/utils/sanitize-html";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Валидация обязательных полей
    if (!data.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Название статьи обязательно" },
        { status: 400 },
      );
    }

    if (!data.slug?.trim()) {
      return NextResponse.json(
        { success: false, message: "Алиас (slug) статьи обязателен" },
        { status: 400 },
      );
    }

    if (!data.author?.trim()) {
      return NextResponse.json(
        { success: false, message: "Автор статьи обязателен" },
        { status: 400 },
      );
    }

    if (!data.categoryId?.trim()) {
      return NextResponse.json(
        { success: false, message: "Категория статьи обязательна" },
        { status: 400 },
      );
    }

    // Подготавливаем данные
    const name = data.name.trim();
    const slug = data.slug.trim().toLowerCase();
    const description = data.description?.trim() || "";
    const keywords = Array.isArray(data.keywords)
      ? data.keywords
      : (data.keywords || "")
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean);
    const image = data.image || "";
    const imageAlt = data.imageAlt || "";
    const author = data.author.trim();
    const categoryId = data.categoryId.trim();
    const categoryName = data.categoryName?.trim() || "";
    const categorySlug = data.categorySlug?.trim() || "";
    const isFeatured = data.isFeatured || false;
    const status = data.status || "draft";

    const db = await getDB();

    // Проверка уникальности slug
    const existingArticle = await db.collection("articles").findOne({ slug });

    if (existingArticle) {
      return NextResponse.json(
        { success: false, message: "Статья с таким алиасом уже существует" },
        { status: 400 },
      );
    }

    // Проверка существования категории
    if (categoryId) {
      const categoryExists = await db
        .collection("article-category")
        .findOne({ _id: ObjectId.createFromHexString(categoryId) });

      if (!categoryExists) {
        return NextResponse.json(
          { success: false, message: "Указанная категория не найдена" },
          { status: 400 },
        );
      }
    }

    // ОЧИЩАЕМ И ОБРАБАТЫВАЕМ КОНТЕНТ
    const sanitizedContent = sanitizeArticleHTML(data.content || "");
    
    if (!sanitizedContent || sanitizedContent.trim() === '' || sanitizedContent === '<p></p>') {
      return NextResponse.json(
        { success: false, message: "Текст статьи не может быть пустым" },
        { status: 400 },
      );
    }

    const finalContent = await processArticleImages(sanitizedContent);

    const result = await db
      .collection("articles")
      .aggregate([
        {
          $group: {
            _id: null,
            maxNumericId: { $max: "$numericId" },
          },
        },
      ])
      .toArray();

    let maxNumericId = 0;
    if (
      result.length > 0 &&
      result[0].maxNumericId !== null &&
      result[0].maxNumericId !== undefined
    ) {
      maxNumericId = result[0].maxNumericId;
    }

    const newNumericId = maxNumericId + 1;

    // Создание новой статьи
    const newArticle = {
      _id: new ObjectId(),
      numericId: newNumericId,
      name,
      slug,
      description,
      keywords,
      image,
      imageAlt,
      author,
      categoryId,
      categoryName,
      categorySlug,
      content: finalContent, // Используем очищенный и обработанный контент
      isFeatured,
      status,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(status === "published" && { publishedAt: new Date().toISOString() }),
    };

    await db.collection("articles").insertOne(newArticle);



    const responseArticle = {
      ...newArticle,
      _id: newArticle._id.toString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Статья успешно создана",
        data: responseArticle,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Ошибка создания статьи:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка создания статьи",
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 },
    );
  }
}