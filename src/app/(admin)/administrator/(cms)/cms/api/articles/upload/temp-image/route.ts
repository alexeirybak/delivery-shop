import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    // Валидация файла
    if (!file) {
      return NextResponse.json(
        { error: 'Файл не выбран' },
        { status: 400 }
      );
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Файл должен быть изображением' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const extension = path.extname(file.name).toLowerCase();
    
    // Проверка расширения
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: 'Недопустимый формат файла. Разрешены: JPG, PNG, WebP' },
        { status: 400 }
      );
    }
    
    // Генерируем уникальное имя с префиксом temp
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const filename = `temp_${timestamp}_${random}${extension}`;
    
    // СОХРАНЯЕМ В ПАПКУ temp (без вложенности)
    const uploadDir = path.join(process.cwd(), 'public', 'temp');
    const filepath = path.join(uploadDir, filename);
    
    // Создаем папку если не существует
    await mkdir(uploadDir, { recursive: true });
    
    // Сохраняем файл
    await writeFile(filepath, buffer);
    
    // URL для доступа к файлу
    const url = `/temp/${filename}`;
    
    return NextResponse.json({ 
      success: true,
      url, 
      filename: filename,
      originalName: originalName,
      fullOriginalName: file.name,
      size: file.size
    });
    
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error);
    return NextResponse.json(
      { 
        error: 'Не удалось загрузить изображение',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}