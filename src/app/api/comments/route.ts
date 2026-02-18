import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const articleId = searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json(
        { error: "Не указан articleId" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const comments = await db
      .collection("comments")
      .find({
        articleId,
      })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedComments = comments.map((comment) => ({
      ...comment,
      _id: comment._id.toString(),
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    }));

    return NextResponse.json({ comments: formattedComments });
  } catch (error) {
    console.error("Ошибка загрузки комментариев:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, parentId, content, authorId, authorName, authorRole } =
      body;

    if (!articleId || !content || !authorId || !authorName || !authorRole) {
      return NextResponse.json(
        { error: "Не хватает данных для создания комментария" },
        { status: 400 },
      );
    }

    const db = await getDB();

    const newComment = {
      articleId,
      parentId: parentId || null,
      content: content.trim(),
      authorId,
      authorName,
      authorRole,
      likes: [],
      isEdited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("comments").insertOne(newComment);

    return NextResponse.json({
      _id: result.insertedId.toString(),
      ...newComment,
      createdAt: newComment.createdAt.toISOString(),
      updatedAt: newComment.updatedAt.toISOString(),
      replies: [],
    });
  } catch (error) {
    console.error("Ошибка создания комментария:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
