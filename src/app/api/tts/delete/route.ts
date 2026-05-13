import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);

    let fileName: string | null = null;

    try {
      const body = await request.json();
      fileName = body.fileName;
    } catch {
      fileName = request.nextUrl.searchParams.get("fileName");
    }

    if (!fileName) {
      return NextResponse.json(
        { error: "Имя файла обязательно" },
        { status: 400 },
      );
    }

    const safeName = path.basename(fileName);
    const filePath = path.join(
      process.cwd(),
      "audio",
      userId,
      safeName,
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true, message: "Файл удалён" });
    } else {
      return NextResponse.json({ error: "Файл не найден" }, { status: 404 });
    }
  } catch (error) {
    console.error("Ошибка удаления:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}
