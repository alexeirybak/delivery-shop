import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../utils/api-routes';
import { ObjectId, UpdateFilter } from 'mongodb';

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

  } catch (error) {
    console.error('Error getting favorites:', error);
    return NextResponse.json(
      { error: 'Ошибка получения избранного' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { productId } = await request.json();

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId и productId обязательны' },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    const updateFilter: UpdateFilter<UserDocument> = {
      $addToSet: { favorites: productId },
      $set: { updatedAt: new Date() }
    };

    const result = await db.collection<UserDocument>('user').updateOne(
      { _id: new ObjectId(userId) },
      updateFilter
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Товар добавлен в избранное' 
    });

  } catch (error) {
    console.error('Error adding favorite:', error);
    return NextResponse.json(
      { error: 'Ошибка добавления в избранное' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const productId = searchParams.get('productId');

    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId и productId обязательны' },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    const updateFilter: UpdateFilter<UserDocument> = {
      $pull: { favorites: productId },
      $set: { updatedAt: new Date() }
    };

    const result = await db.collection<UserDocument>('user').updateOne(
      { _id: new ObjectId(userId) },
      updateFilter
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Товар удален из избранного' 
    });

  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      { error: 'Ошибка удаления из избранного' },
      { status: 500 }
    );
  }
}