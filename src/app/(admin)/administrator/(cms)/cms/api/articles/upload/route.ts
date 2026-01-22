import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;
    // categorySlug больше не нужен, если все в одной папке

    if (!file) {
      return NextResponse.json(
        { error: "Файл не предоставлен" },
        { status: 400 }
      );
    }

    // Читаем файл как буфер
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Генерируем безопасное короткое имя файла
    const originalName = file.name;
    const originalExtension = originalName.split(".").pop()?.toLowerCase() || "jpg";
    
    // Короткое уникальное имя (timestamp + 4 случайных цифр)
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const fileName = `${timestamp}_${random}.${originalExtension}`;

    // Сохраняем в uploads/articles/ (без подпапок по категориям)
    const uploadsDir = path.join(
      process.cwd(), 
      "public", 
      "uploads", 
      "articles"
    );

    // Рекурсивно создаем директорию, если ее нет
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    
    // Сохраняем файл
    await fs.writeFile(filePath, buffer);

    // URL для доступа к файлу
    const publicUrl = `/uploads/articles/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Ошибка загрузки изображения:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке изображения" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return NextResponse.json(
        { error: "Имя файла не указано" },
        { status: 400 }
      );
    }

    // Удаляем из uploads/articles/
    const uploadsDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "articles"
    );
    const filePath = path.join(uploadsDir, fileName);

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