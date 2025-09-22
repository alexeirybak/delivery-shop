import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../../utils/api-routes';
import { ProductCardProps } from '@/types/product';

interface MatchCondition {
  brand: string;
  id?: { $ne: string };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { brand: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeProductId = searchParams.get('excludeProductId');
    const limit = parseInt(searchParams.get('limit') || '4');

    if (!params.brand) {
      return NextResponse.json(
        { error: 'Бренд обязателен' },
        { status: 400 }
      );
    }

    const db = await getDB();
    const brand = decodeURIComponent(params.brand);

    const matchCondition: MatchCondition = { 
      brand: brand 
    };
    
    if (excludeProductId) {
      matchCondition.id = { $ne: excludeProductId };
    }

    const sameBrandProducts = await db
      .collection<ProductCardProps>('products')
      .aggregate([
        { $match: matchCondition },
        { $sample: { size: limit } }
      ])
      .toArray();

    return NextResponse.json({ sameBrandProducts });
  } catch (error) {
    console.error('Ошибка получения товаров бренда:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}