import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../utils/api-routes';

interface ProductData {
  id: number;
  img: string;
  title: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  rating: { score: number; count: number };
  categories: string[];
  weight: number;
  quantity: number;
  tags: string[];
  isHealthyFood: boolean;
  isNonGMO: boolean;
  updatedAt: Date;
  article: string;
  brand: string;
  manufacturer: string;
}

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
      img
    } = body;

    const count = await productsCollection.countDocuments();
    const nextId = count + 1;

    const productData: ProductData = {
      id: nextId,
      img: img || `/images/products/img-${nextId}.jpg`,
      title,
      description,
      basePrice: Number(basePrice),
      discountPercent: Number(discountPercent) || 0,
      rating: { score: 0, count: 0 },
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