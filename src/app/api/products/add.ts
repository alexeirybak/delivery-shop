import { getDB } from '../../../../utils/api-routes';
import { NextApiRequest, NextApiResponse } from 'next';

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

interface RequestBody {
  title: string;
  description: string;
  basePrice: string;
  discountPercent: string;
  weight: string;
  quantity: string;
  article: string;
  brand: string;
  manufacturer: string;
  isHealthyFood: boolean;
  isNonGMO: boolean;
  categories: string[];
  tags: string[];
  img: string | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const db = await getDB();
    const productsCollection = db.collection('products');

    const body: RequestBody = req.body;

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
      basePrice: parseFloat(basePrice),
      discountPercent: parseFloat(discountPercent) || 0,
      rating: { score: 0, count: 0 },
      categories: Array.isArray(categories) ? categories : [],
      weight: parseFloat(weight),
      quantity: parseInt(quantity),
      tags: Array.isArray(tags) ? tags : [],
      isHealthyFood: Boolean(isHealthyFood),
      isNonGMO: Boolean(isNonGMO),
      updatedAt: new Date(),
      article,
      brand,
      manufacturer
    };

    const result = await productsCollection.insertOne(productData);

    res.status(201).json({ 
      success: true, 
      product: { ...productData, _id: result.insertedId } 
    });

  } catch (error) {
    console.error('Error adding product:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
}