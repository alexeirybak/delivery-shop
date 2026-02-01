import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();
    
    if (!query || query.length < 3) {
      return NextResponse.json(
        { error: "Введите минимум 3 символа для поиска" },
        { status: 400 }
      );
    }

    const db = await getDB();

    const articles = await db.collection("articles")
      .find({
        $and: [
          { status: "published" },
          {
            $or: [
              { name: { $regex: query, $options: "i" } },
              { description: { $regex: query, $options: "i" } },
              { content: { $regex: query, $options: "i" } }
            ]
          }
        ]
      })
      .project({
        _id: 1,
        slug: 1,
        name: 1,
        description: 1,
        image: 1,
        imageAlt: 1,
        publishedAt: 1,
        categoryId: 1,
        categorySlug: 1,    
        categoryName: 1    
      })
      .sort({ publishedAt: -1 })
      .limit(20)
      .toArray();

    const articlesData = articles.map((article) => ({
      _id: article._id.toString(),
      slug: article.slug,
      name: article.name,
      image: article.image,
      imageAlt: article.imageAlt,
      description: article.description,
      publishedAt: article.publishedAt,
      category: article.categorySlug ? {
        _id: article.categoryId?.toString(),
        slug: article.categorySlug,
        name: article.categoryName
      } : null
    }));

    return NextResponse.json({
      articles: articlesData,
      count: articlesData.length,
      query
    });

  } catch (error) {
    console.error("Ошибка в поиске статей:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}