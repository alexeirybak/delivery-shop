import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../../utils/api-routes';

export async function GET(
  request: NextRequest,
  { params }: { params: { brand: string } }
) {
  try {
    const db = await getDB();
    const brand = decodeURIComponent(params.brand);

    const products = await db.collection('products')
      .aggregate([
        { 
          $match: { 
            brand: brand,
            quantity: { $gt: 0 }
          } 
        },
        { $sample: { size: 4 } }
      ])
      .toArray();

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch brand products' },
      { status: 500 }
    );
  }
}