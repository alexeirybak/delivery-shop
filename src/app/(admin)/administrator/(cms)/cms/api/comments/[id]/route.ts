import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../../utils/api-routes";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const db = await getDB();

    await db.collection("comments").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          content: "[Комментарий удален]",
          isDeleted: true,
          deletedAt: new Date(),
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ошибка удаления" }, { status: 500 });
  }
}