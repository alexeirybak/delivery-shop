import { NextRequest, NextResponse } from "next/server";
import { Article, Category } from "@/app/(blog)/blog/types";
import { getDB } from "../../../../../utils/api-routes";

interface RouteParams {
  params: Promise<{ category: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { category: categorySlug } = await params;
    const searchParams = request.nextUrl.searchParams;
    const slug = categorySlug;

    const page = parseInt(searchParams.get("page") || "1");
    const itemsPerPage = parseInt(searchParams.get("itemsPerPage")!);
    const skip = (page - 1) * itemsPerPage;

    const db = await getDB();

    const categoryDoc = await db.collection("article-category").findOne({
      slug: slug,
    });

    if (!categoryDoc) {
      return NextResponse.json(
        { error: "Категория не найдена" },
        { status: 404 },
      );
    }

    // Получаем общее количество статей
    const totalArticles = await db.collection("articles").countDocuments({
      categoryId: categoryDoc._id.toString(),
      status: "published",
    });

    // Получаем статьи с пагинацией
    const articles = await db
      .collection("articles")
      .find(
        {
          categoryId: categoryDoc._id.toString(),
          status: "published",
        },
        {
          projection: {
            _id: 1,
            slug: 1,
            name: 1,
            
            image: 1,
            imageAlt: 1,
            description: 1,
            publishedAt: 1,
            isFeatured: 1,
          },
        },
      )
      .sort({ isFeatured: -1, publishedAt: -1 })
      .skip(skip)
      .limit(itemsPerPage)
      .toArray();

    const totalPages = Math.ceil(totalArticles / itemsPerPage);

    const category: Category = {
      _id: categoryDoc._id.toString(),
      name: categoryDoc.name,
      slug: categoryDoc.slug,
      description: categoryDoc.description,
      image: categoryDoc.image,
      imageAlt: categoryDoc.imageAlt,
      keywords: categoryDoc.keywords,
    };

    const articlesData: Article[] = articles.map((article) => ({
      _id: article._id.toString(),
      slug: article.slug,
      name: article.name,
      image: article.image,
      imageAlt: article.imageAlt,
      description: article.description,
      publishedAt: article.publishedAt,
      isFeatured: article.isFeatured
    }));

    return NextResponse.json({
      category,
      articles: articlesData,
      totalArticles,
      totalPages,
      currentPage: page,
      itemsPerPage,
    });
  } catch (error) {
    console.error("Ошибка в API категории:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
