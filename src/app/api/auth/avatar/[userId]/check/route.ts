import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/api-routes";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await params;
    const db = await getDB();

    if (!userId) {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    let userIdObjectId;
    try {
      userIdObjectId = new ObjectId(userId);
    } catch {
      return NextResponse.json({ exists: false }, { status: 400 });
    }

    const fileExists = await db.collection("avatars.files").findOne({
      "metadata.userId": userIdObjectId,
    });

    return NextResponse.json({ exists: !!fileExists });
  } catch {
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}
