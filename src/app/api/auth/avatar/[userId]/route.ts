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
    // Создание экземпляра GridFSBucket для работы с файлами в коллекции "avatars"
    const bucket = new GridFSBucket(db, { bucketName: "avatars" });

    // Проверка наличия userId в запросе
    if (!userId) {
      return NextResponse.json(
        { error: "User ID не предоставлен" },
        { status: 400 } // HTTP 400 - Bad Request
      );
    }

    // Попытка преобразовать строковый userId в ObjectId
    let userIdObjectId;
    try {
      userIdObjectId = new ObjectId(userId);
    } catch {
      // Если преобразование не удалось - возвращаем ошибку
      return NextResponse.json(
        { error: "Неверный формат User ID" },
        { status: 400 } // HTTP 400 - Bad Request
      );
    }

    // Поиск метаданных файла в коллекции avatars.files по userId
    const fileExists = await db.collection("avatars.files").findOne({
      "metadata.userId": userIdObjectId, // Ищем файл, где в metadata есть поле userId
    });

    // Если файл не найден - возвращаем ошибку 404
    if (!fileExists) {
      return NextResponse.json({ error: "Аватар не найден" }, { status: 404 });
    }

    // Создание потока для чтения файла из GridFS по его _id
    const downloadStream = bucket.openDownloadStream(fileExists._id);

    // Сборка файла из chunks (чанков) - частей файла
    const chunks: Buffer[] = [];
    // Асинхронный перебор чанков из потока
    for await (const chunk of downloadStream) {
      chunks.push(chunk); // Добавление каждого чанка в массив
    }

    // Проверка, что файл не пустой
    if (chunks.length === 0) {
      return NextResponse.json(
        { error: "Файл аватара пустой" },
        { status: 404 }
      );
    }

    // Объединение всех чанков в один буфер
    const buffer = Buffer.concat(chunks);

    // Возврат файла в ответе
    return new NextResponse(buffer, {
      status: 200, 
      headers: {
        "Content-Type": fileExists.contentType || "image/jpeg", // MIME-тип файла или image/jpeg по умолчанию
        "Content-Length": buffer.length.toString(), // Размер файла в байтах
        "Cache-Control": "no-cache, no-store, must-revalidate", // Запрет кэширования
        Pragma: "no-cache", // Совместимость с HTTP/1.0
        Expires: "0", // Срок действия кэша
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Ошибка получения аватара" },
      { status: 500 } 
    );
  }
}