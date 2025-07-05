import { NextResponse } from 'next/server';
import { getDB } from '../../../../utils/api-routes';

export async function GET() {
  try {
    const db = await getDB();
    
    // Получаем все категории из коллекции catalog
    const categories = await db.collection('catalog')
      .find({})
      .sort({ order: 1 }) // Сортируем по полю order
      .toArray();

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Ошибка получения категорий:', error);
    return NextResponse.json(
      { error: 'Ошибка получения категорий' },
      { status: 500 }
    );
  }
}