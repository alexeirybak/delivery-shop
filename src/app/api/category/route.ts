import { NextResponse } from 'next/server';
import { getDB } from '../../../../utils/api-routes';
import { Filter } from 'mongodb';
import { ProductCardProps } from '@/types/product';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const filters = searchParams.getAll('filter');
    const priceFrom = searchParams.get('priceFrom');
    const priceTo = searchParams.get('priceTo');
    const startIdx = Number(searchParams.get('startIdx')) || 0;
    const perPage = Number(searchParams.get('perPage')) || 10;
    const getPriceRangeOnly = searchParams.get('getPriceRangeOnly') === 'true';

    // Базовый запрос
    const query: Filter<ProductCardProps> = {};
    
    if (category) {
      query.categories = category;
    }

    // Добавляем фильтры
    if (filters.length > 0) {
      query.$and = filters.map(filter => {
        switch(filter) {
          case 'our-production': return { isOurProduction: true };
          case 'healthy-food': return { isHealthyFood: true };
          case 'non-gmo': return { isNonGMO: true };
          default: return {};
        }
      }).filter(Boolean);
    }

    // Фильтр по цене
    if (priceFrom || priceTo) {
      query.basePrice = {};
      if (priceFrom) query.basePrice.$gte = Number(priceFrom);
      if (priceTo) query.basePrice.$lte = Number(priceTo);
    }

    // Запрос диапазона цен
    if (getPriceRangeOnly) {
      const result = await db.collection<ProductCardProps>('products')
        .aggregate([
          { $match: query },
          {
            $group: {
              _id: null,
              min: { $min: '$basePrice' },
              max: { $max: '$basePrice' }
            }
          }
        ])
        .toArray();

      return NextResponse.json({
        priceRange: result[0] ? {
          min: result[0].min,
          max: result[0].max
        } : { min: 0, max: 0 }
      });
    }

    // Полный запрос с пагинацией
    const [products, totalCount] = await Promise.all([
      db.collection<ProductCardProps>('products')
        .find(query)
        .sort({ _id: 1 })
        .skip(startIdx)
        .limit(perPage)
        .toArray(),
      db.collection<ProductCardProps>('products').countDocuments(query)
    ]);

    return NextResponse.json({
      products,
      totalCount,
      priceRange: { min: 0, max: 0 } 
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}