import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; filename: string }> },
) {
  try {
    const sessionUserId = await getAuthenticatedUserId(request.headers);
    const { userId, filename } = await params;

    if (userId !== sessionUserId) {
      return new NextResponse("Доступ запрещен", { status: 403 });
    }

    const filePath = path.join(
      process.cwd(),
      "uploads",
      "categories",
      userId,
      filename,
    );

    try {
      const fileBuffer = await fs.readFile(filePath);
      const extension = path.extname(filename).toLowerCase();
      let contentType = "image/jpeg";

      if (extension === ".png") contentType = "image/png";
      if (extension === ".gif") contentType = "image/gif";
      if (extension === ".webp") contentType = "image/webp";

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch {
      return new NextResponse("Файл не найден", { status: 404 });
    }
  } catch (error) {
    console.error("Ошибка:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return new NextResponse("Не авторизован", { status: 401 });
    }

    return new NextResponse("Внутренняя ошибка сервера", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; filename: string }> },
) {
  try {
    const sessionUserId = await getAuthenticatedUserId(request.headers);
    const { userId, filename } = await params;

    if (userId !== sessionUserId) {
      return NextResponse.json(
        { success: false, error: "Доступ запрещен" },
        { status: 403 },
      );
    }

    const filePath = path.join(
      process.cwd(),
      "uploads",
      "categories",
      userId,
      filename,
    );

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);

      return NextResponse.json({
        success: true,
        message: "Изображение успешно удалено",
      });
    } catch {
      return NextResponse.json(
        { success: false, error: "Файл не найден" },
        { status: 404 },
      );
    }
  } catch (error) {
    console.error("Ошибка удаления изображения:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json(
        { success: false, error: "Не авторизован" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
