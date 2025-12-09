import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../../utils/api-routes";

interface Params {
  params: {
    id: string;
  };
}

// GET - Получение конкретной статьи
export async function GET(request: Request, { params }: Params) {
  try {
    const db = await getDB();
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID статьи обязателен" },
        { status: 400 }
      );
    }

    // Пробуем искать по ObjectId
    let article;
    if (ObjectId.isValid(id)) {
      article = await db.collection("articles").findOne({
        _id: new ObjectId(id),
      });
    }

    // Если не нашли по ObjectId, ищем по числовому id
    if (!article) {
      const articleId = parseInt(id);
      if (!isNaN(articleId)) {
        article = await db.collection("articles").findOne({
          id: articleId,
        });
      }
    }

    if (!article) {
      return NextResponse.json(
        { success: false, message: "Статья не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...article,
        _id: article._id.toString(),
      },
    });
  } catch (error) {
    console.error("Ошибка получения статьи:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}