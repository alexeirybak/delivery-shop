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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ favorites: [] });
    }

    const db = await getDB();
    const user = await db.collection<UserDocument>('user').findOne({ 
      _id: new ObjectId(userId) 
    });

    return NextResponse.json({ 
      favorites: user?.favorites || [] 
    });

  } catch {
    return NextResponse.json(
      { error: 'Ошибка получения избранного' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, productId, action } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId и productId обязательны' },
        { status: 400 }
      );
    }

    const db = await getDB();
    const userObjectId = new ObjectId(userId);

    if (action === "add") {
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

    if (action === "remove") {
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

    return NextResponse.json({ error: 'Неверное действие' }, { status: 400 });

  } catch {
    return NextResponse.json(
      { error: 'Ошибка изменения избранного' },
      { status: 500 }
    );
  }
}