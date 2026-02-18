import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../utils/api-routes";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Не указан userId" },
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

    const likes = comment.likes || [];
    const hasLiked = likes.includes(userId);

    let newLikes;
    if (hasLiked) {
      newLikes = likes.filter((likeUserId: string) => likeUserId !== userId);
    } else {
      newLikes = [...likes, userId];
    }

    await db.collection("comments").updateOne(
      { _id: commentId },
      { $set: { likes: newLikes } }
    );

    return NextResponse.json({
      liked: !hasLiked, 
      likeCount: newLikes.length,
    });
  } catch (error) {
    console.error("Ошибка при лайке:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}