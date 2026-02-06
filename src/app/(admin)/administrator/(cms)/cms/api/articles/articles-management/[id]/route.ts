import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../../../utils/api-routes";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const db = await getDB();

    if (!ObjectId.isValid(id)) {
      console.error("Неверный ID:", id);
      return NextResponse.json(
        { success: false, message: "Неверный ID статьи" },
        { status: 400 }
      );
    }

    const article = await db
      .collection("articles")
      .findOne({ _id: new ObjectId(id) });

    if (!article) {
      console.error("Статья не найдена:", id);
      return NextResponse.json(
        { success: false, message: "Статья не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...article,
        _id: article._id.toString(),
      },
    });
  } catch (error) {
    console.error("Ошибка получения статьи:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка получения статьи" },
      { status: 500 }
    );
  }
}