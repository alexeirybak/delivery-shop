import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../utils/api-routes';

interface UserFilter {
  role?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const role = searchParams.get('role');

    const db = await getDB();
    
    // Построение условия фильтрации
    const filter: UserFilter = {};
    if (role && role !== 'all') {
      filter.role = role;
    }

    // Получение пользователей с пагинацией
    const users = await db
      .collection('user')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Получение общего количества
    const totalCount = await db.collection('users').countDocuments(filter);

    // Преобразование ObjectId в строки
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name || '',
      surname: user.surname || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'user',
      birthdayDate: user.birthdayDate || '',
      region: user.region || '',
      location: user.location || '',
      gender: user.gender || '',
      card: user.card || '',
      hasCard: user.hasCard || false,
      createdAt: user.createdAt ? user.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: user.updatedAt ? user.updatedAt.toISOString() : new Date().toISOString(),
      emailVerified: user.emailVerified || false,
      phoneNumberVerified: user.phoneNumberVerified || false,
    }));

    return NextResponse.json({
      users: formattedUsers,
      totalCount,
      hasMore: offset + users.length < totalCount,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке пользователей' },
      { status: 500 }
    );
  }
}