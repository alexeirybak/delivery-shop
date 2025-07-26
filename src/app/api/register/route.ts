import { NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";

export async function POST(request: Request) {
  try {
    const {
      email,
      phone,
      surname,
      firstName,
      birthdayDate,
      region,
      location,
      gender,
      card,
      hasCard
    } = await request.json();

    const db = await getDB();

    // 1. Находим верифицированного пользователя
    const user = await db.collection("user").findOne({ 
      email,
      emailVerified: true 
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Сначала завершите верификацию email" },
        { status: 403 } // 403 Forbidden - нет доступа
      );
    }

    // 2. Обновляем ТОЛЬКО дополнительные данные
    await db.collection("user").updateOne(
      { email, emailVerified: true }, // Двойная проверка
      {
        $set: {
          phone,
          surname,
          firstName,
          birthdayDate,
          region,
          location,
          gender,
          card: hasCard ? null : card,
          hasCard,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Profile completion error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}