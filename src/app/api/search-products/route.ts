import { NextRequest, NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { error: 'Поисковый запрос должен содержать минимум 3 символа' },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    const searchRegex = new RegExp(query.trim(), 'i');

    const products = await db.collection("products")
      .find({
        $or: [
          { title: { $regex: searchRegex } },
          { article: { $regex: searchRegex } },
          { description: { $regex: searchRegex } }
        ]
      })
      .project({ 
        id: 1, 
        title: 1, 
        article: 1, 
        basePrice: 1, 
        quantity: 1, 
        categories: 1 
      })
      .sort({ title: 1 }) 
      .toArray();

    return NextResponse.json({ 
      success: true,
      products 
    });

  } catch (error) {
    console.error("Ошибка при поиске продуктов:", error);
    return NextResponse.json(
      { error: "Ошибка сервера при поиске продуктов" },
      { status: 500 }
    );
  }
}