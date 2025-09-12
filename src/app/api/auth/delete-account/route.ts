import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";
import { deleteUserAvatarFromGridFS } from "../../../../../utils/deleteUserAvatar";

export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const { userId } = await request.json();

    const userObjectId = ObjectId.createFromHexString(userId);

    const deleteResult = await db.collection("user").deleteOne({
      _id: userObjectId,
    });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

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
