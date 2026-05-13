import { getDB } from "@/lib/api-routes";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { login, loginType } = await request.json();

    const db = await getDB();

    if (loginType !== "email") {
      return NextResponse.json({ exists: true, verified: true });
    }

    const user = await db.collection("user").findOne({ email: login });

    if (!user) {
      return NextResponse.json({ exists: false, verified: false });
    }

    return NextResponse.json({ 
      exists: true, 
      verified: user.emailVerified 
    });
  } catch (error) {
    console.error("Ошибка проверки логина:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}