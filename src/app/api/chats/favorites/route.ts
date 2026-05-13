import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/api-routes";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { ObjectId } from "mongodb";

interface FavoriteDocument {
  _id: ObjectId;
  userId: string;
  materialId: string;
  sourceCollection: string;
  createdAt: Date;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();

    const favorites = await db
      .collection<FavoriteDocument>("favorites")
      .find({ userId })
      .toArray();

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Ошибка получения избранного:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();
    const { materialId, sourceCollection } = await request.json();

    if (!materialId || !sourceCollection) {
      return NextResponse.json(
        { error: "materialId и sourceCollection обязательны" },
        { status: 400 },
      );
    }

    const existing = await db.collection("favorites").findOne({
      userId,
      materialId,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Материал уже в избранном" },
        { status: 409 },
      );
    }

    const result = await db.collection("favorites").insertOne({
      userId,
      materialId,
      sourceCollection,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      message: "Добавлено в избранное",
    });
  } catch (error) {
    console.error("Ошибка добавления в избранное:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const db = await getDB();
    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get("materialId");

    if (!materialId) {
      return NextResponse.json(
        { error: "materialId обязателен" },
        { status: 400 },
      );
    }

    const result = await db.collection("favorites").deleteOne({
      userId,
      materialId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Материал не найден в избранном" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Удалено из избранного",
    });
  } catch (error) {
    console.error("Ошибка удаления из избранного:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
