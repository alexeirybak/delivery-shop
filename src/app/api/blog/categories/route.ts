import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { BlogCategory } from "@/app/blog/types/categories.types";

export async function GET() {
  try {
    const db = await getDB();
    const categories = await db
      .collection<BlogCategory>("article-category")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Ошибка получения категорий:", error);
    return NextResponse.json(
      { success: false, message: "Ошибка получения категорий" },
      { status: 500 }
    );
  }
}
