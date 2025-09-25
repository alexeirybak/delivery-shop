import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../utils/api-routes';

export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const productsCollection = db.collection('products');

    const body = await request.json();

    const {
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
      img,
      id
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Вставьте изображение товара' },
        { status: 400 }
      );
    }

    const productData = {
      id: id,
      img: img || `/images/products/img-${id}.jpeg`,
      title,
      description,
      basePrice: Number(basePrice),
      discountPercent: Number(discountPercent) || 0,
      rating: { 
        count: 0,
        distribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        }
      },
      categories: Array.isArray(categories) ? categories : [],
      weight: Number(weight),
      quantity: Number(quantity),
      tags: Array.isArray(tags) ? tags : [],
      isHealthyFood: Boolean(isHealthyFood),
      isNonGMO: Boolean(isNonGMO),
      updatedAt: new Date(),
      article,
      brand,
      manufacturer
    };

    const result = await productsCollection.insertOne(productData);

    return NextResponse.json({ 
      success: true, 
      product: { ...productData, _id: result.insertedId } 
    });

  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Ошибка добавления товара' },
      { status: 500 }
    );
  }
}