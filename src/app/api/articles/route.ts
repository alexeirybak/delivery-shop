import { getDBAndRequestBody } from "../../../../utils/api-routes";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const clientPromise = new MongoClient(
  process.env.DELIVERY_SHOP_DB_URL!
).connect();

export async function getArticles() {
  const { db } = await getDBAndRequestBody(clientPromise, null);
  return await db.collection("articles").find().toArray();
}

export async function GET() {
  try {
    const articles = await getArticles();

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Ошибка сервера:", error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  }
}
