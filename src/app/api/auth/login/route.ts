import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const { phoneNumber, password } = await request.json();

    const db = await getDB();
    const user = await db.collection("user").findOne({ phoneNumber });

    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      );
    }

    const bcrypt = await import("bcrypt");
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Неверный пароль" }, { status: 401 });
    }

    const sessionId = randomBytes(16).toString("hex");

    const expiresIn = 30 * 24 * 60 * 60;

    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    await db.collection("session").insertOne({
      token: sessionId,
      userId: user._id.toString(), 
      expiresAt: expiresAt, 
      expiresIn: expiresIn, 
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: request.headers.get("x-forwarded-for") || "", 
      userAgent: request.headers.get("user-agent") || "", 
    });

    const responseData = {
      success: true, 
      message: "Авторизация успешна", 
    };

    const response = NextResponse.json(responseData);

    response.cookies.set("session", sessionId, {
      httpOnly: true, 
      sameSite: "lax",
      expires: expiresAt,
      path: "/", 
    });

    return response;
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json(
      { error: "Ошибка сервера" }, 
      { status: 500 } 
    );
  }
}
