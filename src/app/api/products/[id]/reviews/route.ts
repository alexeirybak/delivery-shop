// app/api/products/[id]/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../../utils/api-routes';
import { ObjectId, Db, Document } from 'mongodb';

export const dynamic = "force-dynamic";

interface ReviewDocument extends Document {
  _id?: ObjectId;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDocument extends Document {
  _id: ObjectId;
  name: string;
  surname: string;
  email: string;
  avatar?: string;
}

interface ProductDocument extends Document {
  _id: ObjectId;
  rating?: {
    rate: number;
    count: number;
  };
}

// Функция для обновления рейтинга товара
async function updateProductRating(db: Db, productId: string) {
  try {
    const reviewsCollection = db.collection<ReviewDocument>('reviews');
    const productsCollection = db.collection<ProductDocument>('products');
    
    const reviews = await reviewsCollection
      .find({ productId })
      .toArray();

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { 
          $set: { 
            rating: {
              rate: Math.round(averageRating * 10) / 10,
              count: reviews.length
            }
          } 
        }
      );
    }
  } catch (error) {
    console.error('Ошибка при обновлении рейтинга товара:', error);
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

    const reviewsCollection = db.collection<ReviewDocument>('reviews');
    const reviews = await reviewsCollection
      .find({ productId: id })
      .sort({ createdAt: -1 })
      .toArray();

    if (reviews.length === 0) {
      return NextResponse.json([]);
    }

    // Получаем информацию о пользователях
    const userIds = reviews.map(review => {
      try {
        return new ObjectId(review.userId);
      } catch {
        return null;
      }
    }).filter(Boolean) as ObjectId[];

    if (userIds.length > 0) {
      const usersCollection = db.collection<UserDocument>('users');
      const users = await usersCollection
        .find({ _id: { $in: userIds } })
        .project({ name: 1, surname: 1, email: 1, avatar: 1 })
        .toArray();

      const userMap = new Map(users.map(user => [user._id.toString(), user]));

      const reviewsWithUsers = reviews.map(review => ({
        _id: review._id?.toString(),
        productId: review.productId,
        userId: review.userId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        user: userMap.get(review.userId) || { name: 'Неизвестный пользователь' }
      }));

      return NextResponse.json(reviewsWithUsers);
    }

    return NextResponse.json(reviews.map(review => ({
      _id: review._id?.toString(),
      productId: review.productId,
      userId: review.userId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: { name: 'Неизвестный пользователь' }
    })));

  } catch (error) {
    console.error('Ошибка при получении отзывов:', error);
    return NextResponse.json(
      { message: 'Ошибка при загрузке отзывов' },
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
    const { userId, rating, comment } = body;

    console.log('Received review data:', { productId, userId, rating, comment });

    if (!userId || !rating || !comment) {
      return NextResponse.json(
        { message: 'Все поля обязательны для заполнения' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: 'Рейтинг должен быть от 1 до 5' },
        { status: 400 }
      );
    }

    const db = await getDB();
    const reviewsCollection = db.collection<ReviewDocument>('reviews');

    // Проверяем, не оставлял ли пользователь уже отзыв на этот товар
    const existingReview = await reviewsCollection.findOne({
      productId,
      userId
    });

    if (existingReview) {
      return NextResponse.json(
        { message: 'Вы уже оставляли отзыв на этот товар' },
        { status: 400 }
      );
    }

    const newReview = {
      productId,
      userId,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await reviewsCollection.insertOne(newReview);

    // Получаем созданный отзыв
    const createdReview = await reviewsCollection.findOne({ 
      _id: result.insertedId 
    });

    if (!createdReview) {
      throw new Error('Не удалось создать отзыв');
    }

    // Обновляем средний рейтинг товара
    await updateProductRating(db, productId);

    // Возвращаем созданный отзыв
    return NextResponse.json({
      _id: createdReview._id?.toString(),
      productId: createdReview.productId,
      userId: createdReview.userId,
      rating: createdReview.rating,
      comment: createdReview.comment,
      createdAt: createdReview.createdAt,
      updatedAt: createdReview.updatedAt
    }, { status: 201 });

  } catch (error) {
    console.error('Ошибка при добавлении отзыва:', error);
    return NextResponse.json(
      { message: 'Внутренняя ошибка сервера при добавлении отзыва' },
      { status: 500 }
    );
  }
}