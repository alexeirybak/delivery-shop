// app/api/auth/user/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    let userId: string | null = null;

    // 1. Пытаемся получить сессию через Better-Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session) {
      userId = session.user.id;
    } else {
      // 2. Если нет Better-Auth сессии, проверяем кастомную
      const sessionCookie = request.headers
        .get("cookie")
        ?.split(";")
        .find((c) => c.trim().startsWith("session="))
        ?.split("=")[1];

      if (!sessionCookie) {
        return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
      }

      const db = await getDB();
      const customSession = await db.collection("sessions").findOne({
        id: sessionCookie,
      });

      if (!customSession || new Date(customSession.expiresAt) < new Date()) {
        return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
      }

      userId = customSession.userId;
    }

    // 3. Находим пользователя по ID
    if (!userId) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const db = await getDB();
    const user = await db.collection("user").findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // 4. Возвращаем данные пользователя
    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      surname: user.surname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      emailVerified: user.emailVerified,
      phoneNumberVerified: user.phoneNumberVerified,
      gender: user.gender,
      birthdayDate: user.birthdayDate,
      location: user.location,
      region: user.region,
    });
    
  } catch (error) {
    console.error("Error in user API:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}