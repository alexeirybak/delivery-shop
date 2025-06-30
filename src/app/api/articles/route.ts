import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const db = await getDB();
    const url = new URL(request.url);
    const articlesLimit = url.searchParams.get("articlesLimit");

    if (articlesLimit) {
      const limit = parseInt(articlesLimit);
      
      const articles = await db
        .collection("articles")
        .find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray(); // <- Вот это было пропущено!
      
      return NextResponse.json(articles);
    }

    const allArticles = await db.collection("articles").find().toArray();
    return NextResponse.json(allArticles);
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке статей" },
      { status: 500 }
    );
  }
}