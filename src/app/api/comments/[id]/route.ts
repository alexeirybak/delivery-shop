import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../utils/api-routes";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();

    const result = await db.collection("comments").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          content: '[Комментарий удален]',
          isDeleted: true,
          deletedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Комментарий не найден" },
        { status: 404 }
      );
    }

    const updatedComment = await db.collection("comments").findOne({
      _id: new ObjectId(id)
    });

    if (!updatedComment) {
      return NextResponse.json(
        { error: "Комментарий не найден после обновления" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      comment: {
        _id: updatedComment._id.toString(),
        content: updatedComment.content,
        isDeleted: updatedComment.isDeleted,
        deletedAt: updatedComment.deletedAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Ошибка удаления комментария:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}











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

    if (comment.isDeleted) {
      return NextResponse.json(
        { error: "Нельзя редактировать удаленный комментарий" },
        { status: 400 }
      );
    }

    const now = new Date();
    await db.collection("comments").updateOne(
      { _id: commentId },
      {
        $set: {
          content: content.trim(),
          isEdited: true,
          editedAt: now,
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
