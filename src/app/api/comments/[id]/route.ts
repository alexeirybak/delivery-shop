import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../utils/api-routes";

// DELETE - удаление комментария
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();

    const result = await db.collection("comments").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Комментарий не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка удаления комментария:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}

// PATCH - редактирование комментария
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content, userId } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Комментарий не может быть пустым" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const commentId = new ObjectId(id);

    // Проверяем существование и права
    const comment = await db.collection("comments").findOne({
      _id: commentId,
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Комментарий не найден" },
        { status: 404 }
      );
    }

    if (comment.authorId !== userId) {
      return NextResponse.json(
        { error: "Нет прав на редактирование" },
        { status: 403 }
      );
    }

    // Обновляем комментарий
    const now = new Date();
    await db.collection("comments").updateOne(
      { _id: commentId },
      {
        $set: {
          content: content.trim(),
          isEdited: true,
          editedAt: now.toISOString(),
          updatedAt: now,
        },
      }
    );

    return NextResponse.json({
      success: true,
      content: content.trim(),
      isEdited: true,
      editedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("Ошибка редактирования комментария:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}