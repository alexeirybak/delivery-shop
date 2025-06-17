import { getDBAndRequestBody } from "../../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// Создаем и сохраняем подключение к MongoDB
const clientPromise = new MongoClient(
  process.env.DELIVERY_SHOP_DB_URL!
).connect();

export async function GET() {
  try {
    // Получаем экземпляр базы данных
    const { db } = await getDBAndRequestBody(clientPromise, null);

    // Получаем товары с категорией "new", ограничиваем 4 элементами
    const actionProducts = await db.collection("products")
      .find({ categories: "actions" })
      .toArray();

    // Преобразуем ObjectId в строку для корректной сериализации
    const formattedProducts = actionProducts.map((product) => ({
      ...product,
      _id: product._id.toString(), // Преобразуем ObjectId в строку
    }));

    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
