import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; fileName: string }> },
) {
  try {
    const { userId, fileName } = await params;

    const safeFileName = path.basename(fileName);
    const filePath = path.join(
      process.cwd(),
      "audio",
      userId,
      safeFileName,
    );

    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Audio serve error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
