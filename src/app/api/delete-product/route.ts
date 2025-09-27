import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../utils/api-routes';

export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const productsCollection = db.collection('products');

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID продукта обязателен' },
        { status: 400 }
      );
    }

    const existingProduct = await productsCollection.findOne({ 
      id: parseInt(id) 
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Продукт не найден' },
        { status: 404 }
      );
    }

    const result = await productsCollection.deleteOne({ 
      id: parseInt(id) 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Не удалось удалить продукт' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Продукт успешно удален' 
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Ошибка удаления товара' },
      { status: 500 }
    );
  }
}