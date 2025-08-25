import { NextResponse } from "next/server";
import { getBetterAuthSession, getCustomSessionToken, getUserById, getValidCustomSession } from "../../../../../utils/auth-helpers";

export async function GET(request: Request) {
  try {
    const betterAuthSession = await getBetterAuthSession(request.headers);
    if (betterAuthSession) {
      const userData = await getUserById(betterAuthSession.user.id);
      if (userData) return NextResponse.json(userData);
    }

    const sessionToken = getCustomSessionToken(request.headers.get("cookie"));
    if (!sessionToken) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const session = await getValidCustomSession(sessionToken);
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userData = await getUserById(session.userId);
    if (!userData) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error in user API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}