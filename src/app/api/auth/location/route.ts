import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const body = await request.json();

    const { userId, region, location } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Просто обновляем данные без возврата документа
    const result = await db.collection("user").updateOne(
      { _id: ObjectId.createFromHexString(userId) },
      {
        $set: {
          region,
          location,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Возвращаем только статус успеха
    return NextResponse.json({
      success: true,
      message: "Location updated successfully",
    });
  } catch (error) {
    console.error("Error updating user location:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
