import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ category: string; slug: string }> },
) {
  try {
    const { category, slug } = await params;
    const db = await getDB();

    const articleDoc = await db.collection("articles").findOne({
      slug: slug,
      categorySlug: category,
      status: "published",
    });

    if (!articleDoc) {
      return NextResponse.json(
        { error: "Статья не найдена в указанной категории" },
        { status: 404 },
      );
    }

    const responseData = {
      article: {
        _id: articleDoc._id.toString(),
        slug: articleDoc.slug,
        name: articleDoc.name,
        content: articleDoc.content,
        description: articleDoc.description,
        image: articleDoc.image,
        imageAlt: articleDoc.imageAlt,
        publishedAt: articleDoc.publishedAt,
        author: articleDoc.author,
        categorySlug: articleDoc.categorySlug,
        categoryName: articleDoc.categoryName,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Ошибка API статьи:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
