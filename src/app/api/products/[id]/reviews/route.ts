import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../../utils/api-routes";
import { ObjectId, Db, Document } from "mongodb";

export const dynamic = "force-dynamic";

interface ReviewDocument extends Document {
  _id?: ObjectId;
  productId: string;
  userId: string;
  userName: string; 
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductDocument extends Document {
  _id: ObjectId;
  rating?: {
    rate: number;
    count: number;
  };
}

async function updateProductRating(db: Db, productId: string) {
  try {
    const reviewsCollection = db.collection<ReviewDocument>("reviews");
    const productsCollection = db.collection<ProductDocument>("products");

    const reviews = await reviewsCollection.find({ productId }).toArray();

    if (reviews.length > 0) {
      // Считаем распределение оценок
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

      reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[review.rating as keyof typeof distribution]++;
        }
      });

      // Вычисляем средний рейтинг
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const averageRating =
        Math.round((totalRating / reviews.length) * 10) / 10;

      // Пытаемся преобразовать productId в число для поиска
      const numericProductId = parseInt(productId);
      const isNumericId = !isNaN(numericProductId);

      const updateFilter = isNumericId
        ? { id: numericProductId }
        : { _id: new ObjectId(productId) };

      // Проверяем, существует ли продукт
      const product = await productsCollection.findOne(updateFilter);
      if (!product) {
        console.error("Продукт не найден:", updateFilter);
        return;
      }

      // Обновляем или создаем рейтинг
      await productsCollection.updateOne(updateFilter, {
        $set: {
          "rating.average": averageRating,
          "rating.count": reviews.length,
          "rating.distribution": distribution,
          updatedAt: new Date(),
        },
      });

      console.log("Рейтинг товара обновлен:", {
        productId,
        average: averageRating,
        count: reviews.length,
        distribution,
      });
    }
  } catch (error) {
    console.error("Ошибка при обновлении рейтинга товара:", error);
  }
}

// GET - получение отзывов для товара
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();

    const reviewsCollection = db.collection<ReviewDocument>("reviews");
    const reviews = await reviewsCollection
      .find({ productId: id })
      .sort({ createdAt: -1 })
      .toArray();

    if (reviews.length === 0) {
      return NextResponse.json([]);
    }

    // Просто возвращаем отзывы с userName из коллекции reviews
    return NextResponse.json(
      reviews.map((review) => ({
        _id: review._id?.toString(),
        productId: review.productId,
        userId: review.userId,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      }))
    );
  } catch (error) {
    console.error("Ошибка при получении отзывов:", error);
    return NextResponse.json(
      { message: "Ошибка при загрузке отзывов" },
      { status: 500 }
    );
  }
}

// POST - добавление нового отзыва
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params;
    const body = await request.json();
    const { userId, userName, rating, comment } = body;

    console.log("Received review data:", {
      productId,
      userId,
      userName,
      rating,
      comment,
    });

    if (!userId || !userName || !rating || !comment) {
      return NextResponse.json(
        { message: "Все поля обязательны для заполнения" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Рейтинг должен быть от 1 до 5" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const reviewsCollection = db.collection<ReviewDocument>("reviews");

    // Проверяем, не оставлял ли пользователь уже отзыв на этот товар
    const existingReview = await reviewsCollection.findOne({
      productId,
      userId,
    });

    if (existingReview) {
      return NextResponse.json(
        { message: "Вы уже оставляли отзыв на этот товар" },
        { status: 400 }
      );
    }

    const newReview = {
      productId,
      userId,
      userName,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await reviewsCollection.insertOne(newReview);

    // Получаем созданный отзыв
    const createdReview = await reviewsCollection.findOne({
      _id: result.insertedId,
    });

    if (!createdReview) {
      throw new Error("Не удалось создать отзыв");
    }

    // Обновляем рейтинг товара
    await updateProductRating(db, productId);

    // Возвращаем созданный отзыв
    return NextResponse.json(
      {
        _id: createdReview._id?.toString(),
        productId: createdReview.productId,
        userId: createdReview.userId,
        userName: createdReview.userName,
        rating: createdReview.rating,
        comment: createdReview.comment,
        createdAt: createdReview.createdAt,
        updatedAt: createdReview.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при добавлении отзыва:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера при добавлении отзыва" },
      { status: 500 }
    );
  }
}