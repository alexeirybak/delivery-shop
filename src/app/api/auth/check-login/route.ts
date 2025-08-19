import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";

export async function POST(request: Request) {
  try {
    const { login, loginType } = await request.json();

    const db = await getDB();

    const query =
      loginType === "email"
        ? { email: login }
        : { phoneNumber: login.replace(/\D/g, "") };

    const user = await db.collection("user").findOne(query);

    if (!user) {
      return NextResponse.json({ exist: false, verified: false });
    }

    const verified =
      loginType === "email" ? !!user.emailVerified : !!user.phoneNumberVerified;

    return NextResponse.json({ exists: true, verified });
  } catch (error) {
    console.error("Ошибка проверки логина:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
