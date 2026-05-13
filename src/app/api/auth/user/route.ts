import { NextResponse } from "next/server";
import { getBetterAuthSession } from "@/lib/auth-helpers";

export async function GET(request: Request) {
  try {
    const session = await getBetterAuthSession(request.headers);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    return NextResponse.json(session.user);
  } catch (error) {
    console.error("Ошибка получения пользователя:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}