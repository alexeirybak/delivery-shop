import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../../utils/api-routes";

interface RouteParams {
  params: Promise<{ category: string; slug: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { category, slug } = await params;

    const db = await getDB();

    // 1. Находим категорию
    const categoryDoc = await db.collection("article-category").findOne({
      slug: category,
    });

    if (!categoryDoc) {
      return NextResponse.json(
        { error: "Категория не найдена" },
        { status: 404 },
      );
    }

    // 2. Находим статью в этой категории
    const articleDoc = await db.collection("articles").findOne({
      categoryId: categoryDoc._id.toString(),
      slug: slug,
      status: "published",
    });

    if (!articleDoc) {
      return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
    }

    // 3. Увеличиваем счетчик просмотров (атомарная операция)
    const result = await db.collection("articles").findOneAndUpdate(
      { _id: articleDoc._id },
      { 
        $inc: { views: 1 }
      },
      { 
        returnDocument: 'after',
        projection: {
          _id: 1,
          slug: 1,
          name: 1,
          image: 1,
          imageAlt: 1,
          description: 1,
          content: 1,
          publishedAt: 1,
          author: 1,
          views: 1,
          categoryName: 1,
          categorySlug: 1
        }
      }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Не удалось обновить счетчик просмотров" },
        { status: 500 }
      );
    }

    const updatedArticle = result;

    const categoryData = {
      _id: categoryDoc._id.toString(),
      name: categoryDoc.name,
      slug: categoryDoc.slug,
      description: categoryDoc.description,
    };

    const article = {
      _id: updatedArticle._id.toString(),
      slug: updatedArticle.slug,
      name: updatedArticle.name,
      image: updatedArticle.image,
      imageAlt: updatedArticle.imageAlt,
      description: updatedArticle.description,
      content: updatedArticle.content,
      publishedAt: updatedArticle.publishedAt,
      author: updatedArticle.author,
      views: updatedArticle.views || 0,
    };

    return NextResponse.json(
      {
        category: categoryData,
        article: article,
      },
    );
  } catch (error) {
    console.error("Ошибка в API статьи:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

//src\app\api\blog\[category]\route.ts