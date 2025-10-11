import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../../utils/api-routes";
import { GridFSBucket, ObjectId } from "mongodb";

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ userId: string }> } 
) {
  try {
    const { userId } = await params;

    const db = await getDB();
    const bucket = new GridFSBucket(db, { bucketName: "avatars" });

    if (!userId) {
      return NextResponse.json(
        { error: "User ID не предоставлен" },
        { status: 400 } 
      );
    }

    let userIdObjectId;
    try {
      userIdObjectId = new ObjectId(userId);
    } catch {
      return NextResponse.json(
        { error: "Неверный формат User ID" },
        { status: 400 } 
      );
    }

    const fileExists = await db.collection("avatars.files").findOne({
      "metadata.userId": userIdObjectId, 
    });

    if (!fileExists) {
      return NextResponse.json({ error: "Аватар не найден" }, { status: 404 });
    }

    const downloadStream = bucket.openDownloadStream(fileExists._id);

    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk); 
    }

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "Файл аватара пустой" },
        { status: 404 }
      );
    }

    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      status: 200, 
      headers: {
        "Content-Type": fileExists.contentType || "image/jpeg", 
        "Content-Length": buffer.length.toString(), 
        "Cache-Control": "no-cache, no-store, must-revalidate", 
        Pragma: "no-cache", 
        Expires: "0", 
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Ошибка получения аватара" },
      { status: 500 } 
    );
  }
}