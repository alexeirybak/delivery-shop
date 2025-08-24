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

    // СОЗДАЕМ СЕССИЮ вручную (так как Better-Auth не предоставляет createSession)
    const sessionToken = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дней

    // Сохраняем сессию в коллекцию sessions (как требует Better-Auth)
    await db.collection("sessions").insertOne({
      id: sessionToken, // session token как id
      userId: user._id.toString(), // ID пользователя как строка
      expiresAt: expiresAt,
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("remote-address") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Формируем ответ с данными пользователя
    const responseData = {
      success: true,
      user: {
        _id: user._id.toString(),
        name: user.name,
        surname: user.surname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
        phoneNumberVerified: user.phoneNumberVerified,
        gender: user.gender,
        birthdayDate: user.birthdayDate,
        location: user.location,
        region: user.region
      },
    };

    // Создаем ответ и устанавливаем session cookie
    const response = NextResponse.json(responseData);
    
    // Устанавливаем cookie для сессии (как это делает Better-Auth)
    response.cookies.set({
      name: "session", // Стандартное имя cookie в Better-Auth
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Ошибка авторизации:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}