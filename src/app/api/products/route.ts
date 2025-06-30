import { getDB } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const randomLimit = url.searchParams.get("randomLimit"); // Новый параметр

    if (!category) {
      return NextResponse.json(
        { message: "Параметр категории обязателен" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const query = {
      categories: category, // Фильтр по категории
      quantity: { $gt: 0 }, // Фильтр по количеству (только товары в наличии)
    };

    // Режим случайных товаров (только если есть randomLimit)
    if (randomLimit) {
      // Создаем агрегационный пайплайн MongoDB:
      const pipeline = [
        // 1. Стадия $match - фильтрация документов:
        { $match: query }, // Применяем условия фильтрации (категория и наличие товара)

        // 2. Стадия $sample - случайная выборка:
        { $sample: { size: parseInt(randomLimit) } },
        // Берем случайные документы из отфильтрованной выборки
        // size указывает количество случайных документов для выборки
      ];

      // Выполняем агрегационный запрос:
      const products = await db
        .collection("products")
        .aggregate(pipeline) // Применяем наш пайплайн к коллекции products
        .toArray(); // Преобразуем результат в массив JavaScript

      // Возвращаем результат клиенту:
      return NextResponse.json(products);
    }

    // Обычный режим (все товары)
    const products = await db.collection("products").find(query).toArray();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке продуктов" },
      { status: 500 }
    );
  }
}
