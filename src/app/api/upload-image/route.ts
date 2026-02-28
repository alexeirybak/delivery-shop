import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const imageId = formData.get("imageId") as string;

    if (!image) {
      return NextResponse.json({ error: "Файл не загружен" }, { status: 400 });
    }

    if (!imageId) {
      return NextResponse.json(
        { error: "ID изображения не указан" },
        { status: 400 },
      );
    }

    if (!image.type.includes("image")) {
      return NextResponse.json(
        { error: "Загруженный файл не является изображением" },
        { status: 400 },
      );
    }

    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Файл слишком большой (макс. 5MB)" },
        { status: 400 },
      );
    }

    const filename = `img-${imageId}.jpeg`;

    const uploadDir = path.join(process.cwd(), "uploads", "products");
    const fullPath = path.join(uploadDir, filename);

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(fullPath, buffer);

    const imagePath = `/api/uploads/products/${filename}`;

    return NextResponse.json({
      success: true,
      product: {
        id: parseInt(imageId),
        img: imagePath,
        filename: filename,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при загрузке изображения" },
      { status: 500 },
    );
  }
}
