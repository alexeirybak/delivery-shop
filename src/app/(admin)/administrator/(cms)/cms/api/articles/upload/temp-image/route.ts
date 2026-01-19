import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const articleId = formData.get('articleId') as string;
    const isTemp = formData.get('isTemp') as string;
    
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

    // Проверка размера файла (макс 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Файл слишком большой. Максимальный размер: 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Сохраняем оригинальное имя файла
    const originalName = file.name.replace(/\.[^/.]+$/, ""); // Без расширения
    const extension = path.extname(file.name).toLowerCase();
    
    // Проверка допустимых расширений
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: 'Недопустимый формат файла. Разрешены: JPG, PNG, WebP' },
        { status: 400 }
      );
    }
    
    // Генерируем уникальное имя файла
    const uniqueFilename = `${uuidv4()}${extension}`;
    
    // Определяем папку для сохранения
    const baseFolder = isTemp === 'true' ? 'temp' : 'uploads/articles';
    
    // Для временных файлов используем articleId из запроса
    // Для постоянных файлов articleId должен быть ID статьи из БД
    const folderId = isTemp === 'true' ? articleId : (articleId || 'general');
    
    const uploadDir = path.join(process.cwd(), 'public', baseFolder, folderId);
    const filepath = path.join(uploadDir, uniqueFilename);
    
    // Создаем папку если не существует
    await mkdir(uploadDir, { recursive: true });
    
    // Сохраняем файл
    await writeFile(filepath, buffer);
    
    // URL для доступа к файлу
    const url = `/${baseFolder}/${folderId}/${uniqueFilename}`;
    
    console.log('📁 Изображение сохранено:', {
      url,
      folder: baseFolder,
      folderId,
      filename: uniqueFilename,
      originalName: file.name,
      size: file.size,
      isTemp: isTemp === 'true'
    });
    
    return NextResponse.json({ 
      success: true,
      url, 
      filename: uniqueFilename,
      originalName: originalName,
      fullOriginalName: file.name,
      articleId: folderId,
      isTemp: isTemp === 'true',
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