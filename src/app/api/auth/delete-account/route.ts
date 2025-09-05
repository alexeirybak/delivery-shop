import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../utils/api-routes";
import { deleteUserAvatarFromGridFS } from "../../../../../utils/deleteUserAvatar";

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
    // Используем вашу готовую утилиту
    await deleteUserAvatarFromGridFS(userId);

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