import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../utils/api-routes";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDB();
    const { id } = params;

    // Пробуем найти статью по ObjectId
    let article;
    try {
      article = await db
        .collection("articles")
        .findOne({ _id: new ObjectId(id) });
    } catch {
      // Если не валидный ObjectId, ищем по строковому _id
      article = await db
        .collection("articles")
        .findOne({ _id: id });
    }

    if (!article) {
      return NextResponse.json(
        { message: "Статья не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке статьи" },
      { status: 500 }
    );
  }
}