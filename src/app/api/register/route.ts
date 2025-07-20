import { NextResponse } from "next/server";
import { getDB } from "../../../../utils/api-routes";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const {
      phone,
      surname,
      firstName,
      password,
      birthdayDate,
      region,
      location,
      gender,
      card,
      email,
      hasCard,
    } = await request.json();

    const db = await getDB();
    const normalizedPhone = phone.replace(/\D/g, '');

    // Проверка существующего пользователя (критически важно)
    const existingUser = await db.collection("users").findOne({ 
      phone: normalizedPhone 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким телефоном уже существует" },
        { status: 400 }
      );
    }

    // Хеширование пароля (обязательно)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Преобразование даты рождения (формат уже проверен на фронте)
    const [day, month, year] = birthdayDate.split(".");
    const formattedBirthdayDate = new Date(`${year}-${month}-${day}`);

    // Создание пользователя
    const result = await db.collection("users").insertOne({
      phone: normalizedPhone,
      surname,
      firstName,
      password: hashedPassword,
      birthdayDate: formattedBirthdayDate,
      region,
      location,
      gender,
      card: hasCard ? null : card,
      email,
      hasCard,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      userId: result.insertedId,
      user: {
        phone: normalizedPhone,
        surname,
        firstName,
        email
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}