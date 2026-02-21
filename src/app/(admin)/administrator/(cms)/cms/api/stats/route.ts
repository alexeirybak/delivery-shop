import { NextResponse } from "next/server";
import { getDB } from "../../../../../../../../utils/api-routes";

export async function GET() {
  try {
    const db = await getDB();

    const publishedCount = await db.collection("articles").countDocuments({
      status: { $in: ["published", "archived"] },
    });

    const articles = await db
      .collection("articles")
      .find({}, { projection: { views: 1 } })
      .toArray();

    let totalViews = 0;
    for (const article of articles) {
      totalViews += article.views || 0;
    }

    return NextResponse.json({
      publishedCount,
      totalViews,
    });
  } catch (error) {
    console.error("Ошибка загрузки статистики:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
