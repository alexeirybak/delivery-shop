import { NextResponse } from "next/server";
import { getArticles } from "../../../../utils/api-routes";
export const revalidate = 3600;

export async function GET() {
  try {
    const articles = await getArticles();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
