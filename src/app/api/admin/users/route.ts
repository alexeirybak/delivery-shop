import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../utils/api-routes';

interface UserFilter {
  role?: string;
  name?: { $regex: string; $options: string };
  surname?: { $regex: string; $options: string };
  email?: { $regex: string; $options: string };
  phoneNumber?: { $regex: string; $options: string };
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  region?: string;
  location?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const page = parseInt(searchParams.get('page') || '1');
    const role = searchParams.get('role');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    const managerRegion = searchParams.get('managerRegion');
    const managerLocation = searchParams.get('managerLocation');
    const isManager = searchParams.get('isManager') === 'true';

    const db = await getDB();
    
    // Построение условия фильтрации
    const filter: UserFilter = {};
    
    if (role && role !== 'all') {
      filter.role = role;
    }

    // Если это менеджер, фильтруем по его региону и городу
    if (isManager && managerRegion && managerLocation) {
      filter.region = managerRegion;
      filter.location = managerLocation;
    }

    // Расчет смещения
    const offset = (page - 1) * limit;

    // Определение сортировки
    const sortOptions: { [key: string]: 1 | -1 } = {};
    sortOptions[sortBy] = sortDirection === 'asc' ? 1 : -1;

    // Получение пользователей с пагинацией и сортировкой
    const users = await db
      .collection('user')
      .find(filter)
      .sort(sortOptions)
      .skip(offset)
      .limit(limit)
      .toArray();

    // Получение общего количества
    const totalCount = await db.collection('user').countDocuments(filter);

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
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: offset + users.length < totalCount,
    });
  } catch (error) {
    console.error('Ошибка при загрузке пользователей:', error);
    return NextResponse.json(
      { error: 'Ошибка при загрузке пользователей' },
      { status: 500 }
    );
  }
}