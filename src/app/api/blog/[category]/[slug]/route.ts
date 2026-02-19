import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../../utils/api-routes";

interface RouteParams {
  params: Promise<{ category: string; slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { category, slug } = await params;

    // Читаем роль из query-параметров
    const url = new URL(request.url);
    const currentUserRole = url.searchParams.get('role');
 
    const canCount =
      currentUserRole !== "admin" && currentUserRole !== "manager";
 

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
      status: { $in: ["published", "archived"] },
    });

    if (!articleDoc) {
      return NextResponse.json({ error: "Статья не найдена" }, { status: 404 });
    }

    console.log('Current views before update:', articleDoc.views);

    let updatedArticle = articleDoc;

    // 3. Увеличиваем счетчик просмотров только если canCount = true
    if (canCount) {
      console.log('Increasing view counter...');
      
      const result = await db.collection("articles").findOneAndUpdate(
        { _id: articleDoc._id },
        {
          $inc: { views: 1 },
        },
        {
          returnDocument: "after",
          projection: {
            _id: 1,
            slug: 1,
            name: 1,
            image: 1,
            imageAlt: 1,
            description: 1,
            keywords: 1,
            content: 1,
            publishedAt: 1,
            updatedAt: 1,
            createdAt: 1,
            author: 1,
            views: 1,
            categoryName: 1,
            categorySlug: 1,
            status: 1,
          },
        },
      );

      if (result) {
        updatedArticle = result;
        
      } else {
        console.log('Update failed!');
      }
    } else {
      console.log('View counter NOT increased (admin/manager)');
    }

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
      keywords: updatedArticle.keywords,
      image: updatedArticle.image,
      imageAlt: updatedArticle.imageAlt,
      description: updatedArticle.description,
      content: updatedArticle.content,
      publishedAt: updatedArticle.publishedAt,
      createdAt: updatedArticle.createdAt,
      updatedAt: updatedArticle.updatedAt,
      author: updatedArticle.author,
      views: updatedArticle.views || 0,
      status: updatedArticle.status,
    };

    return NextResponse.json({
      category: categoryData,
      article: article,
    });
  } catch (error) {
    console.error("Ошибка в API статьи:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
