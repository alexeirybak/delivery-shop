import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../../utils/api-routes';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'Необходимы userId и role' },
        { status: 400 }
      );
    }

    if (!['user', 'manager', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Недопустимая роль' },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    // Проверяем существование пользователя
    const user = await db.collection('user').findOne({ 
      _id: ObjectId.createFromHexString(userId) 
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Обновляем роль пользователя
    const result = await db.collection('user').updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      { $set: { 
          role,
          updatedAt: new Date() 
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: 'Не удалось обновить роль' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Роль успешно обновлена' 
    });

  } catch (error) {
    console.error('Ошибка при обновлении роли:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении роли' },
      { status: 500 }
    );
  }
}