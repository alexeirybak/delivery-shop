import { NextResponse } from 'next/server';
import { getDB } from '../../../../utils/api-routes';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    if (!query) {
      return NextResponse.json({ products: [], categories: [] });
    }

    const db = await getDB();
    
    // Ищем товары (регистронезависимо)
    const products = await db.collection('products')
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { categories: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } } // Добавляем поиск по tags
        ]
      })
      .limit(5)
      .toArray();

    // Собираем только уникальные категории (исключая tags)
    const allCategories = products.flatMap(p => p.categories);
    const uniqueCategories = [...new Set(allCategories)];

    return NextResponse.json({
      products,
      categories: uniqueCategories
    });
  } catch (error) {
    console.error('Ошибка поиска:', error);
    return NextResponse.json(
      { error: 'Ошибка поиска' },
      { status: 500 }
    );
  }
}