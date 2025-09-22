import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../../utils/api-routes";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();

    const reviews = await db.collection("reviews")
      .find({ productId: id })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Ошибка при получении отзывов:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке отзывов" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const { userId, userName, rating, comment } = await request.json();

    if (!userId || !userName || !rating || !comment) {
      return NextResponse.json(
        { message: "Все поля обязательны" },
        { status: 400 }
      );
    }

    const db = await getDB();

    // Проверяем существующий отзыв
    const existingReview = await db.collection("reviews").findOne({
      productId,
      userId,
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "Вы уже оставляли отзыв" },
        { status: 400 }
      );
    }

    // Получаем текущий продукт чтобы обновить distribution
    const product = await db.collection("products").findOne({
      id: parseInt(productId)
    });

    if (!product) {
      return NextResponse.json(
        { message: "Продукт не найден" },
        { status: 400 }
      );
    }

    // ОБНОВЛЯЕМ DISTRIBUTION В КОЛЛЕКЦИИ PRODUCTS
    const newDistribution = { ...product.rating.distribution };
    const ratingKey = rating.toString() as keyof typeof newDistribution;
    newDistribution[ratingKey] += 1;

    const newCount = product.rating.count + 1;
    
    // Пересчитываем средний рейтинг на основе distribution
    const totalRating = newDistribution["1"] * 1 + newDistribution["2"] * 2 + newDistribution["3"] * 3 + newDistribution["4"] * 4 + newDistribution["5"] * 5;
    const newAverage = Math.round((totalRating / newCount) * 10) / 10;

    // ОБНОВЛЯЕМ ПРОДУКТ В КОЛЛЕКЦИИ PRODUCTS
    await db.collection("products").updateOne(
      { id: parseInt(productId) },
      {
        $set: {
          "rating.distribution": newDistribution,
          "rating.count": newCount,
          "rating.average": newAverage,
          updatedAt: new Date()
        }
      }
    );

    // СОЗДАЕМ ОТЗЫВ В КОЛЛЕКЦИИ REVIEWS
    const newReview = {
      productId,
      userId,
      userName,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("reviews").insertOne(newReview);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Ошибка при добавлении отзыва:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}