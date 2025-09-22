import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../utils/api-routes';

export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const productsCollection = db.collection('products');
    const count = await productsCollection.countDocuments();
    const nextId = count + 1;

    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'Файл не загружен' },
        { status: 400 }
      );
    }

    if (!image.type.includes('image/jpeg')) {
      return NextResponse.json(
        { error: 'Разрешены только JPG изображения' },
        { status: 400 }
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Файл слишком большой (макс. 5MB)' },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Здесь будет логика сохранения файла (если нужно)
    // Пока просто возвращаем путь

    const imagePath = `/images/products/img-${nextId}.jpg`;

    return NextResponse.json({
      success: true,
      product: {
        id: nextId,
        img: imagePath,
        filename: `img-${nextId}.jpg`
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}