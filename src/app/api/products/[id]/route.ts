import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();

    // Пытаемся найти по числовому ID
    let product = await db.collection("products").findOne({
      id: parseInt(id),
    });

    // Если не найдено по числовому ID, пробуем по ObjectId
    if (!product) {
      product = await db.collection("products").findOne({
        _id: new ObjectId(id),
      });
    }

    if (!product) {
      return NextResponse.json(
        { message: "Продукт не найден" },
        { status: 404 }
      );
    }

    // Получаем актуальное количество отзывов (если нужно)
    const reviewsCount = await db.collection("reviews").countDocuments({
      productId: id,
    });

    // Если у продукта есть рейтинг, обновляем count
    const updatedProduct = { ...product };
    if (updatedProduct.rating) {
      updatedProduct.rating.count = reviewsCount;
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Ошибка при получении продукта:", error);
    return NextResponse.json(
      { message: "Ошибка сервера при получении продукта" },
      { status: 500 }
    );
  }
}
