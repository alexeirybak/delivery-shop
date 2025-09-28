import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../utils/api-routes';
import { ObjectId } from 'mongodb';

interface UserDocument {
  _id: ObjectId;
  email: string;
  password: string;
  favorites: string[];
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const { action, userId, productId } = await request.json();

    if (!userId) {
      return NextResponse.json({ favorites: [] });
    }

    const db = await getDB();
    const userObjectId = new ObjectId(userId);

    // GET - получение избранного
    if (action === "GET") {
      const user = await db.collection<UserDocument>('user').findOne({ 
        _id: userObjectId 
      });
      return NextResponse.json({ 
        favorites: user?.favorites || [] 
      });
    }

    // ADD - добавление в избранное
    if (action === "ADD" && productId) {
      const result = await db.collection<UserDocument>('user').updateOne(
        { _id: userObjectId },
        { 
          $addToSet: { favorites: productId },
          $set: { updatedAt: new Date() }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    // REMOVE - удаление из избранного
    if (action === "REMOVE" && productId) {
      const result = await db.collection<UserDocument>('user').updateOne(
        { _id: userObjectId },
        { 
          $pull: { favorites: productId },
          $set: { updatedAt: new Date() }
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Неверные параметры' }, { status: 400 });

  } catch (error) {
    console.error('Error in favorites API:', error);
    return NextResponse.json(
      { error: 'Ошибка работы с избранным' },
      { status: 500 }
    );
  }
}