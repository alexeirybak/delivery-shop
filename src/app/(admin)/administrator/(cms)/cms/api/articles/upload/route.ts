import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const categorySlug = formData.get("categorySlug") as string; // Получаем slug категории

    if (!file) {
      return NextResponse.json(
        { error: "Файл не предоставлен" },
        { status: 400 }
      );
    }

    // Если категория не указана, используем дефолтную папку
    const categoryFolder = categorySlug?.trim() || "uncategorized";

    // Читаем файл как буфер без изменения размера
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Генерируем безопасное имя файла
    const originalName = file.name;
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const cleanName = baseName
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

    const timestamp = Date.now();
    const safeName = cleanName || "image";
    const originalExtension =
      originalName.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${safeName}_${timestamp}.${originalExtension}`;

    // Создаем путь с папкой category внутри articles
    const publicDir = path.join(
      process.cwd(), 
      "public", 
      "articles",        // Основная папка для статей
      categoryFolder    // Подпапка с названием категории
    );

    // Рекурсивно создаем директорию, если ее нет
    await fs.mkdir(publicDir, { recursive: true });

    const filePath = path.join(publicDir, fileName);
    
    // Сохраняем оригинальный файл без изменений
    await fs.writeFile(filePath, buffer);

    // URL для доступа к файлу
    const publicUrl = `/articles/${categoryFolder}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
      category: categoryFolder,
    });
  } catch (error) {
    console.error("Ошибка загрузки изображения:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке изображения" },
      { status: 500 }
    );
  }
}

// Обновленная DELETE функция для удаления с учетом категории
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file");
    const category = searchParams.get("category"); // Добавляем параметр категории

    if (!fileName) {
      return NextResponse.json(
        { error: "Имя файла не указано" },
        { status: 400 }
      );
    }

    // Если категория не указана, ищем файл во всех подпапках
    if (!category) {
      return NextResponse.json(
        { error: "Категория не указана" },
        { status: 400 }
      );
    }

    const categoryFolder = category.trim();
    const publicDir = path.join(
      process.cwd(), 
      "public", 
      "articles",      
      categoryFolder 
    );
    
    const filePath = path.join(publicDir, fileName);

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);

      return NextResponse.json({
        success: true,
        message: "Изображение успешно удалено",
      });
    } catch {
      return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
    }
  } catch (error) {
    console.error("Ошибка удаления изображения:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении изображения" },
      { status: 500 }
    );
  }
}