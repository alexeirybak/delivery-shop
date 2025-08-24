// Импорт NextResponse из Next.js для создания HTTP ответов
import { NextResponse } from "next/server";
// Импорт функции getDB для подключения к базе данных
import { getDB } from "../../../../../utils/api-routes";
// Импорт модуля crypto для генерации криптографически безопасных случайных значений
import { randomBytes } from "crypto";

// Экспорт асинхронной функции POST для обработки POST запросов
export async function POST(request: Request) {
  try {
    // Парсим JSON тело запроса и извлекаем phoneNumber и password
    const { phoneNumber, password } = await request.json();

    // Получаем подключение к базе данных
    const db = await getDB();
    // Ищем пользователя в коллекции 'user' по номеру телефона
    const user = await db.collection("user").findOne({ phoneNumber });

    // Если пользователь не найден, возвращаем ошибку 404
    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" }, // Сообщение об ошибке
        { status: 404 } // HTTP статус 404 Not Found
      );
    }

    // Динамически импортируем модуль bcrypt для сравнения паролей
    const bcrypt = await import("bcrypt");
    // Сравниваем введенный пароль с хешем пароля из базы данных
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Если пароль неверный, возвращаем ошибку 401
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Неверный пароль" }, // Сообщение об ошибке
        { status: 401 } // HTTP статус 401 Unauthorized
      );
    }

    // СОЗДАЕМ СЕССИЮ ТОЧНО КАК Better-Auth
    // Генерируем случайный ID сессии длиной 32 байта в hex формате
    const sessionId = randomBytes(32).toString('hex');
    // Устанавливаем время expiration сессии (30 дней от текущего момента)
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Вставляем новую сессию в коллекцию 'session'
    await db.collection("session").insertOne({
      token: sessionId, // Better-Auth использует "token", а не "id"
      userId: user._id.toString(), // ID пользователя в виде строки
      expiresAt: expiresAt, // Время истечения сессии
      createdAt: new Date(), // Текущая дата создания
      updatedAt: new Date(), // Текущая дата обновления
      ipAddress: request.headers.get("x-forwarded-for") || "", // IP адрес клиента или пустая строка
      userAgent: request.headers.get("user-agent") || "" // User-Agent браузера или пустая строка
    });

    // Формируем данные для успешного ответа
    const responseData = {
      success: true, // Флаг успешной операции
      message: "Авторизация успешна" // Сообщение об успехе
    };

    // Создаем NextResponse с JSON данными
    const response = NextResponse.json(responseData);
    // Устанавливаем куку сессии в ответ
    response.cookies.set('session', sessionId, {
      httpOnly: true, // Кука доступна только на сервере (защита от XSS)
      sameSite: 'lax', // Защита от CSRF атак
      expires: expiresAt, // Время жизни куки совпадает с сессией
      path: '/' // Кука доступна для всех путей на домене
    });

    // Возвращаем ответ с кукой и данными
    return response;

  } catch (error) {
    // Логируем ошибку в консоль для debugging
    console.error("Ошибка авторизации:", error);
    // Возвращаем ошибку сервера с статусом 500
    return NextResponse.json(
      { error: "Ошибка сервера" }, // Сообщение об ошибке
      { status: 500 } // HTTP статус 500 Internal Server Error
    );
  }
}