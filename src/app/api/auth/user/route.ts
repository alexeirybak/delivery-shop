import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // 1. Сначала пробуем через Better-Auth
    try {
      const session = await auth.api.getSession({
        headers: request.headers,
      });

      if (session) {
        const db = await getDB();
        const user = await db.collection("user").findOne({
          _id: new ObjectId(session.user.id),
        });

        if (user) {
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
        }
      }
    } catch {
      console.log('Better-Auth session not found, trying custom session');
    }

    // 2. Если Better-Auth не сработал, пробуем кастомную сессию
    const sessionCookie = request.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const db = await getDB();
    const session = await db.collection("session").findOne({ 
      token: sessionCookie
    });

    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    if (new Date(session.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Сессия истекла" }, { status: 401 });
    }

    const user = await db.collection("user").findOne({
      _id: new ObjectId(session.userId),
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

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