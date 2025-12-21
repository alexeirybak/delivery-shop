import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Файл не предоставлен" },
        { status: 400 }
      );
    }

    // Проверка типа файла
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Неподдерживаемый формат изображения. Используйте JPG, PNG, GIF или WebP",
        },
        { status: 400 }
      );
    }

    // Проверка размера (5MB максимум)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Размер файла не должен превышать 5MB" },
        { status: 400 }
      );
    }

    // Чтение файла
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Генерация читаемого имени файла
    const originalName = file.name;
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const cleanName = baseName
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");

    const timestamp = Date.now();
    const safeName = cleanName || "image";

    // Сохраняем оригинальное расширение файла
    const originalExtension =
      originalName.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${safeName}_${timestamp}.${originalExtension}`;

    // Оптимизация изображения с белым фоном
    let optimizedBuffer: Buffer;

    // Если хотите сохранить прозрачность для PNG/GIF, но добавить белый фон для остальных:
    if (originalExtension === "png") {
      optimizedBuffer = await sharp(buffer)
        .resize(800, 450, {
          fit: "contain",
          // Не добавляем background для PNG, чтобы сохранить прозрачность
          position: "center",
          withoutEnlargement: true,
        })
        .png({ quality: 80 })
        .toBuffer();
    } else if (originalExtension === "gif") {
      optimizedBuffer = await sharp(buffer, { animated: true })
        .resize(800, 450, {
          fit: "contain",
          // Не добавляем background для GIF, чтобы сохранить прозрачность
          position: "center",
          withoutEnlargement: true,
        })
        .gif()
        .toBuffer();
    } else {
      // Для JPEG, WebP и других - добавляем белый фон
      optimizedBuffer = await sharp(buffer)
        .resize(800, 450, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
          position: "center",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    // Создание директории
    const publicDir = path.join(process.cwd(), "public", "blogCategories");
    await fs.mkdir(publicDir, { recursive: true });

    // Сохранение файла
    const filePath = path.join(publicDir, fileName);
    await fs.writeFile(filePath, optimizedBuffer);

    // URL для доступа из браузера
    const publicUrl = `/blogCategories/${fileName}`;

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

    const publicDir = path.join(process.cwd(), "public", "blogCategories");
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
