import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "Файл не предоставлен" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name;
    const originalExtension =
      originalName.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const fileName = `${timestamp}_${random}.${originalExtension}`;

    const uploadsDir = path.join(
      process.cwd(),
      "uploads",
      "articles",
    );

    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/api/uploads/articles/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Ошибка загрузки изображения:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке изображения" },
      { status: 500 },
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
        { status: 400 },
      );
    }

    const uploadsDir = path.join(
      process.cwd(),
      "uploads",
      "articles",
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
      { status: 500 },
    );
  }
}