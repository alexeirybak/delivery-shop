import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const {
      phone,
      surname,
      firstName,
      password,
      confirmPassword,
      birthdayDate,
      region,
      location,
      gender,
      card,
      email,
      hasCard,
    } = await request.json();

    // Валидация данных
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Пароли не совпадают" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 6 символов" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким телефоном уже существует" },
        { status: 400 }
      );
    }

    // Преобразуем дату рождения в формат Date
    let formattedBirthdayDate = null;
    if (birthdayDate) {
      const [day, month, year] = birthdayDate.split(".");
      formattedBirthdayDate = new Date(`${year}-${month}-${day}`);
    }

    // Создаем нового пользователя
    const user = new User({
      phone,
      surname,
      firstName,
      password,
      birthdayDate: formattedBirthdayDate,
      region,
      location,
      gender,
      card: hasCard ? null : card,
      email,
      hasCard,
    });

    await user.save();

    return NextResponse.json(
      {
        success: true,
        userId: user._id,
        user: {
          phone: user.phone,
          surname: user.surname,
          firstName: user.firstName,
          email: user.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ошибка при регистрации" },
      { status: 500 }
    );
  }
}
