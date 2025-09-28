import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../utils/api-routes';

export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const productsCollection = db.collection('products');

    const body = await request.json();

    const {
      id,
      title,
      description,
      basePrice,
      discountPercent,
      weight,
      quantity,
      article,
      brand,
      manufacturer,
      isHealthyFood,
      isNonGMO,
      categories,
      tags,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID продукта обязателен' },
        { status: 400 }
      );
    }

    const updateData = {
      title,
      description,
      basePrice: Number(basePrice),
      discountPercent: Number(discountPercent) || 0,
      weight: Number(weight),
      quantity: Number(quantity),
      article,
      brand,
      manufacturer,
      isHealthyFood: Boolean(isHealthyFood),
      isNonGMO: Boolean(isNonGMO),
      categories: Array.isArray(categories) ? categories : [],
      tags: Array.isArray(tags) ? tags : [],
      updatedAt: new Date(),
    };

    const result = await productsCollection.updateOne(
      { id: parseInt(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Продукт не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Продукт успешно обновлен' 
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления товара' },
      { status: 500 }
    );
  }
}