import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../utils/api-routes";

interface ActionRequestBody {
  action: 'update' | 'delete' | 'changeStatus' | 'getArticle';
  id?: string;
  data?: Record<string, unknown>;
  newStatus?: string;
}

export async function POST(request: Request) {
  try {
    const db = await getDB();
    const body: ActionRequestBody = await request.json();
    
    const { action, id, data, newStatus } = body;

    if (!id && action !== 'getArticles') {
      return NextResponse.json(
        { success: false, message: "ID статьи обязателен" },
        { status: 400 }
      );
    }

    switch (action) {
      case 'getArticle': {
        // Можно показывать все статьи, включая удаленные
        const article = await db.collection("articles").findOne({
          _id: new ObjectId(id),
        });

        if (!article) {
          return NextResponse.json(
            { success: false, message: "Статья не найдена" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: article,
        });
      }

      case 'update': {
        if (!data) {
          return NextResponse.json(
            { success: false, message: "Данные для обновления обязательны" },
            { status: 400 }
          );
        }

        // Если обновляем категорию, проверяем её существование
        if (data.category && data.category !== article?.category) {
          const categoryExists = await db.collection("categories").findOne({
            slug: data.category,
            status: "active"
          });

          if (!categoryExists) {
            return NextResponse.json(
              { success: false, message: "Выбранная категория не существует" },
              { status: 400 }
            );
          }
        }

        const result = await db.collection("articles").updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              ...data,
              updatedAt: new Date().toISOString(),
            },
          }
        );

        if (result.matchedCount === 0) {
          return NextResponse.json(
            { success: false, message: "Статья не найдена" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Статья обновлена",
        });
      }

      case 'changeStatus': {
        if (!newStatus) {
          return NextResponse.json(
            { success: false, message: "Новый статус обязателен" },
            { status: 400 }
          );
        }

        const result = await db.collection("articles").updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              status: newStatus,
              updatedAt: new Date().toISOString(),
            },
          }
        );

        if (result.matchedCount === 0) {
          return NextResponse.json(
            { success: false, message: "Статья не найдена" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Статус обновлен",
        });
      }

      // Реальное удаление (оставлено на случай, если нужно)
      case 'delete': {
        const result = await db.collection("articles").deleteOne({
          _id: new ObjectId(id),
        });

        if (result.deletedCount === 0) {
          return NextResponse.json(
            { success: false, message: "Статья не найдена" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Статья удалена",
        });
      }

      default:
        return NextResponse.json(
          { success: false, message: "Неизвестное действие" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Ошибка в API действий:", error);
    const errorMessage = error instanceof Error ? error.message : "Неизвестная ошибка";
    return NextResponse.json(
      { success: false, message: "Ошибка сервера", error: errorMessage },
      { status: 500 }
    );
  }
}