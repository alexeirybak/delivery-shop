import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
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

    const timestamp = Date.now();
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-z0-9]/gi, "_");
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `${safeName}_${timestamp}.${extension}`;

    let optimizedBuffer: Buffer;

    if (extension === "png") {
      optimizedBuffer = await sharp(buffer)
        .resize(800, 450, { fit: "fill", withoutEnlargement: false })
        .png({ quality: 80 })
        .toBuffer();
    } else if (extension === "gif") {
      optimizedBuffer = await sharp(buffer, { animated: true })
        .resize(800, 450, { fit: "fill", withoutEnlargement: false })
        .gif()
        .toBuffer();
    } else {
      optimizedBuffer = await sharp(buffer)
        .resize(800, 450, { fit: "fill", withoutEnlargement: false })
        .jpeg({ quality: 80 })
        .toBuffer();
    }

    const userUploadDir = path.join(
      process.cwd(),
      "uploads",
      "categories",
      userId,
    );
    await fs.mkdir(userUploadDir, { recursive: true });

    const filePath = path.join(userUploadDir, fileName);
    await fs.writeFile(filePath, optimizedBuffer);

    const publicUrl = `/api/workbook/uploads/categories/${userId}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: fileName,
    });
  } catch (error) {
    console.error("Ошибка загрузки изображения:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Ошибка при загрузке изображения" },
      { status: 500 },
    );
  }
}
