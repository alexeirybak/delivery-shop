import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    try {
      await getAuthenticatedUserId(request.headers);
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { path: filePath } = await params;

    const fullPath = path.join(process.cwd(), "uploads", ...filePath);
    const normalizedPath = path.normalize(fullPath);

    if (!normalizedPath.startsWith(path.join(process.cwd(), "uploads"))) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    try {
      await fs.access(normalizedPath);
    } catch {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(normalizedPath);
    const ext = path.extname(normalizedPath).toLowerCase();
    const contentType: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
    };

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType[ext] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}