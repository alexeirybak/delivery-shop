import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../utils/api-routes";

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const db = await getDB();
    const { slug } = params;

    console.log("Запрос статьи по slug:", slug);

    const article = await db.collection("articles").findOne({ slug });

    if (!article) {
      console.log("Статья не найдена по slug:", slug);

      // Пытаемся найти по ID (если slug - это ObjectId)
      try {
        const articleById = await db.collection("articles").findOne({
          _id: new ObjectId(slug),
        });

        if (articleById) {
          return NextResponse.json(articleById);
        }
      } catch (idError) {
        // Невалидный ObjectId - игнорируем
      }

      return NextResponse.json(
        { message: "Статья не найдена" },
        { status: 404 }
      );
    }

    // Увеличиваем счетчик просмотров
    await db
      .collection("articles")
      .updateOne({ _id: article._id }, { $inc: { views: 1 } });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Ошибка при получении статьи:", error);
    return NextResponse.json(
      {
        message: "Ошибка при загрузке статьи",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
