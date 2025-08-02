import { NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const db = await getDB();
    const user = await db.collection("user").findOne({ email });

    if (!user) {
      return NextResponse.json({ exists: false, verified: false });
    }

    const verified = !!user.emailVerified;

    return NextResponse.json({ 
      exists: true, 
      verified 
    });
  } catch (error) {
    console.error("Ошибка проверки пользователя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}