import { CONFIG } from "../../../../config/config";
import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const db = await getDB();
    const url = new URL(request.url);

    const articlesLimit = url.searchParams.get("articlesLimit");
    const startIdx = parseInt(url.searchParams.get("startIdx") || "0");
    const perPage = parseInt(
      url.searchParams.get("perPage") ||
        CONFIG.ITEMS_PER_PAGE_MAIN_ARTICLES.toString()
    );

    if (articlesLimit) {
      const limit = parseInt(articlesLimit);

      const articles = await db
        .collection("articles")
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();
      return NextResponse.json(articles);
    }

    const totalCount = await db.collection("articles").countDocuments();

    const articles = await db
      .collection("articles")
      .find()
      .sort({ createdAt: -1 })
      .skip(startIdx)
      .limit(perPage)
      .toArray();

    return NextResponse.json({ articles, totalCount });
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке статей" },
      { status: 500 }
    );
  }
}
