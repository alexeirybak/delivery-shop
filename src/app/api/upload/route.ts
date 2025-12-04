import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
    }

    // Проверка типа файла
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Можно загружать только изображения" },
        { status: 400 }
      );
    }

    // Проверка размера (макс 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Размер файла не должен превышать 10MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Генерация уникального имени
    const extension = path.extname(file.name);
    const filename = `${uuidv4()}${extension}`;

    // Путь для сохранения
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadsDir, filename);

    // Создаем папку, если её нет
    try {
      await writeFile(filepath, buffer);
    } catch (error: unknown) {
      if (error.code === "ENOENT") {
        const fs = await import("fs/promises");
        await fs.mkdir(uploadsDir, { recursive: true });
        await writeFile(filepath, buffer);
      } else {
        throw error;
      }
    }

    // Возвращаем URL
    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error("Ошибка загрузки:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке файла" },
      { status: 500 }
    );
  }
}
