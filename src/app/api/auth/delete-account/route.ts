import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { GridFSBucket, ObjectId, Db } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID не предоставлен" },
        { status: 400 }
      );
    }

    let userObjectId;
    try {
      userObjectId = ObjectId.createFromHexString(userId);
    } catch {
      return NextResponse.json(
        { message: "Неверный формат User ID" },
        { status: 400 }
      );
    }

    // 1. Сначала удаляем пользователя
    const deleteResult = await db.collection("user").deleteOne({
      _id: userObjectId,
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // 2. ПОСЛЕ успешного удаления пользователя удаляем аватар
    await deleteUserAvatarFromGridFS(db, userObjectId);

    return NextResponse.json(
      { message: "Аккаунт успешно удален" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Ошибка при удалении аккаунта:", error);

    return NextResponse.json(
      {
        message: "Не удалось удалить аккаунт. Попробуйте позже.",
      },
      { status: 500 }
    );
  }
}

// Функция для удаления аватара из GridFS с правильной типизацией
async function deleteUserAvatarFromGridFS(db: Db, userId: ObjectId): Promise<void> {
  try {
    const bucket = new GridFSBucket(db, { bucketName: "avatars" });

    // Ищем файл аватара пользователя
    const avatarFile = await db.collection("avatars.files").findOne({
      "metadata.userId": userId,
    });

    if (avatarFile) {
      // Удаляем файл из GridFS (удаляет и chunks и files)
      await bucket.delete(avatarFile._id);
      console.log(`Аватар пользователя ${userId} удален`);
    }
  } catch (error) {
    console.error("Ошибка при удалении аватара:", error);
  }
}