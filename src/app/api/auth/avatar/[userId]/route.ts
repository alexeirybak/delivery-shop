// app/api/auth/avatar/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../../utils/api-routes";
import { GridFSBucket, ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Ожидаем получение параметров
    const { userId } = await params;
    
    const db = await getDB();
    const bucket = new GridFSBucket(db, { bucketName: "avatars" });

    console.log("Requested userId:", userId);

    if (!userId) {
      console.log("UserId is undefined");
      return NextResponse.json({ error: "User ID не предоставлен" }, { status: 400 });
    }

    // Преобразуем строку userId в ObjectId для поиска
    let userIdObjectId;
    try {
      userIdObjectId = new ObjectId(userId);
    } catch {
      console.log("Invalid userId format:", userId);
      return NextResponse.json({ error: "Неверный формат User ID" }, { status: 400 });
    }

    // Ищем файл аватара по userId в metadata (используя ObjectId)
    const fileExists = await db.collection("avatars.files").findOne({
      "metadata.userId": userIdObjectId,
    });

    console.log("Found file:", fileExists);

    if (!fileExists) {
      console.log("Avatar not found for userId:", userId);
      return NextResponse.json({ error: "Аватар не найден" }, { status: 404 });
    }

    // Создаем поток для чтения файла
    const downloadStream = bucket.openDownloadStream(fileExists._id);

    // Преобразуем поток в Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }

    if (chunks.length === 0) {
      console.log("Empty avatar file for userId:", userId);
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
  } catch (error) {
    console.error("Error retrieving avatar:", error);
    return NextResponse.json(
      { error: "Ошибка получения аватара" },
      { status: 500 }
    );
  }
}