import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const userAudioDir = path.join(process.cwd(), "audio", userId);

    const files: { fileName: string; url: string; createdAt: number }[] = [];

    if (fs.existsSync(userAudioDir)) {
      const fileNames = fs.readdirSync(userAudioDir);

      for (const fileName of fileNames) {
        const filePath = path.join(userAudioDir, fileName);
        const stats = fs.statSync(filePath);
        files.push({
          fileName,
          url: `/api/tts/${userId}/${fileName}`,
          createdAt: stats.birthtimeMs,
        });
      }
    }

    files.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ files });
  } catch (error) {
    console.error("List error:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Ошибка получения списка" },
      { status: 500 },
    );
  }
}
