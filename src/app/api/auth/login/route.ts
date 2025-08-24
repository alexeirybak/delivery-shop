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
    // Генерируем криптографически безопасный случайный ID для сессии
    // 32 байта = 256 бит, преобразованные в hex-строку
    const sessionId = randomBytes(32).toString("hex");

    // Устанавливаем время жизни сессии в секундах (7 дней)
    // 7 дней * 24 часа * 60 минут * 60 секунд
    const expiresIn = 7 * 24 * 60 * 60;

    // Конвертируем время жизни в абсолютную дату истечения
    // Date.now() возвращает текущее время в миллисекундах
    // expiresIn * 1000 преобразует секунды в миллисекунды
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    // Вставляем новую запись сессии в коллекцию "session" MongoDB
    await db.collection("session").insertOne({
      token: sessionId, // Уникальный идентификатор сессии (как в Better-Auth)
      userId: user._id.toString(), // ID пользователя в виде строки
      expiresAt: expiresAt, // Дата истечения сессии (для удобства запросов)
      expiresIn: expiresIn, // Время жизни в секундах (для совместимости с Better-Auth)
      createdAt: new Date(), // Дата создания записи (текущее время)
      updatedAt: new Date(), // Дата последнего обновления (текущее время)
      ipAddress: request.headers.get("x-forwarded-for") || "", // IP адрес клиента или пустая строка
      userAgent: request.headers.get("user-agent") || "", // Информация о браузере клиента или пустая строка
    });

    // Создаем объект с данными для успешного ответа
    const responseData = {
      success: true, // Флаг успешного выполнения операции
      message: "Авторизация успешна", // Сообщение для пользователя
    };

    // Создаем HTTP response с JSON данными
    const response = NextResponse.json(responseData);

    // Устанавливаем сессионную куку в ответ
    response.cookies.set("session", sessionId, {
      httpOnly: true, // Защита от XSS - кука недоступна через JavaScript
      sameSite: "lax", // Защита от CSRF - кука отправляется с cross-site запросами
      expires: expiresAt, // Дата истечения куки (совпадает с сессией)
      path: "/", // Кука действительна для всех путей на домене
    });

    // Возвращаем подготовленный response клиенту
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
