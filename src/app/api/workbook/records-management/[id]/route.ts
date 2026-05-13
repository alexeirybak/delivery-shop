import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/api-routes";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const db = await getDB();

    if (!ObjectId.isValid(id)) {
      console.error("Неверный ID:", id);
      return NextResponse.json(
        { success: false, message: "Неверный ID записи" },
        { status: 400 },
      );
    }

    const record = await db
      .collection("records")
      .findOne({ _id: new ObjectId(id) });

    if (!record) {
      console.error("Запись не найдена:", id);
      return NextResponse.json(
        { success: false, message: "Запись не найдена" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...record,
        _id: record._id.toString(),
      },
    });
  } catch (error) {
    console.error("Ошибка получения записи:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка получения записи" },
      { status: 500 },
    );
  }
}
