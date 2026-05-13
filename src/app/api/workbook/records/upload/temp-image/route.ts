import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getAuthenticatedUserId } from '@/app/api/utils/getAuthenticatedUserId';

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Файл не выбран' },
        { status: 400 }
      );
    }

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
    
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: 'Недопустимый формат файла. Разрешены: JPG, PNG, WebP' },
        { status: 400 }
      );
    }
    
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    const filename = `temp_${timestamp}_${random}${extension}`;
    
    // Добавляем userId в путь
    const uploadDir = path.join(process.cwd(), 'uploads', 'temp', userId);
    const filepath = path.join(uploadDir, filename);
    
    await mkdir(uploadDir, { recursive: true });
    
    await writeFile(filepath, buffer);
    
    // URL тоже содержит userId
    const url = `/api/uploads/temp/${userId}/${filename}`;
    
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
    
    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Не удалось загрузить изображение',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка'
      },
      { status: 500 }
    );
  }
}