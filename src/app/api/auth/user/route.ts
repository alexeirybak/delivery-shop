// app/api/auth/user/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDB } from "../../../../../utils/api-routes";
import { ObjectId } from "mongodb"; // Добавляем импорт

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });
    
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const db = await getDB();
    
    // Преобразуем string ID в ObjectId
    const user = await db.collection("user").findOne({
      _id: new ObjectId(session.user.id) // ← ИСПРАВЛЕНИЕ ЗДЕСЬ
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
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
      region: user.region
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}