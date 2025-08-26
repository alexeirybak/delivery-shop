import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../../utils/api-routes";
import { GridFSBucket, ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDB();
    const bucket = new GridFSBucket(db, { bucketName: "avatars" });

    const fileId = new ObjectId(params.id);

    // Проверяем существование файла
    const fileExists = await db
      .collection("avatars.files")
      .findOne({ _id: fileId });
    if (!fileExists) {
      return NextResponse.json({ error: "Аватар не найден" }, { status: 404 });
    }

    const downloadStream = bucket.openDownloadStream(fileId);
    const chunks: Buffer[] = [];

    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    // Убедитесь что возвращаете изображение с правильными headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": fileExists.contentType || "image/jpeg",
        "Content-Length": fileExists.length.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error retrieving avatar:", error);
    return NextResponse.json(
      { error: "Ошибка получения аватара" },
      { status: 500 }
    );
  }
}
