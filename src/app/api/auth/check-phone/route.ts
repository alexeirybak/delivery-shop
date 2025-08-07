import { NextResponse } from "next/server";
import { getDB } from "../../../../../utils/api-routes";

export async function POST(request: Request) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Номер телефона обязателен" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const user = await db.collection("user").findOne({ 
      phoneNumber 
    });

    if (!user) {
      return NextResponse.json({ 
        exists: false, 
        verified: false 
      });
    }

    const verified = !!user.phoneNumberVerified;

    return NextResponse.json({ 
      exists: true, 
      verified 
    });
  } catch (error) {
    console.error("Ошибка проверки телефона:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 }
    );
  }
}