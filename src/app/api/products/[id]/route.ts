import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";
import { ProductCardProps, ProductRating } from "@/types/product";

export const dynamic = "force-dynamic";

interface Review {
  _id: ObjectId;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс для продукта в MongoDB (с ObjectId)
interface ProductDB {
  _id: ObjectId;
  id: number;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  rating: ProductRating;
  tags: string[];
  weight: number;
  quantity: number;
  categories: string[];
  article: string;
  brand: string;
  manufacturer: string;
  isHealthyFood: boolean;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();

    // Ищем продукт по числовому ID
    let product = await db.collection<ProductDB>("products").findOne({
      id: parseInt(id),
    });

    // Если не найдено по числовому ID, пробуем по ObjectId
    if (!product) {
      try {
        product = await db.collection<ProductDB>("products").findOne({
          _id: new ObjectId(id),
        });
      } catch {
        // Если id не валидный ObjectId, игнорируем ошибку
        console.log("Invalid ObjectId format, skipping search by _id");
      }
    }

    if (!product) {
      return NextResponse.json(
        { message: "Продукт не найден" },
        { status: 404 }
      );
    }

    // Получаем отзывы и рассчитываем рейтинг на бэкенде
    const reviews = await db.collection<Review>("reviews").find({
      productId: id,
    }).toArray();

    const rating = calculateRating(reviews);
    
    // Конвертируем в тип для фронтенда (ObjectId -> string)
    const updatedProduct: ProductCardProps = {
      ...product,
      _id: product._id.toString(),
      rating
    };

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Ошибка при получении продукта:", error);
    return NextResponse.json(
      { message: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

// Функция расчета рейтинга (используется на бэкенде)
function calculateRating(reviews: Review[]): ProductRating {
  if (reviews.length === 0) {
    return {
      average: 0,
      count: 0,
      rate: 0,
      distribution: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
    };
  }

  const distribution = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  let totalRating = 0;

  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      const ratingKey = review.rating.toString() as keyof typeof distribution;
      distribution[ratingKey]++;
      totalRating += review.rating;
    }
  });

  const average = Math.round((totalRating / reviews.length) * 10) / 10;

  return {
    average,
    count: reviews.length,
    rate: average,
    distribution
  };
}