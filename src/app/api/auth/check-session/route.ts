// Импорт NextResponse из Next.js для создания HTTP ответов
import { NextResponse } from "next/server";
// Импорт функции getDB для подключения к базе данных
import { getDB } from "../../../../../utils/api-routes";

// Экспорт асинхронной функции GET для обработки GET запросов
export async function GET(request: Request) {
  try {
    // Извлекаем куку сессии из заголовков запроса
    const sessionCookie = request.headers
      .get("cookie") // Получаем все куки из заголовка Cookie
      ?.split(";") // Разделяем строку кук по точке с запятой
      .find((c) => c.trim().startsWith("session=")) // Ищем куку с именем "session"
      ?.split("=")[1]; // Разделяем по знаку равно и берем значение куки

    // Если кука сессии не найдена, возвращаем что пользователь не авторизован
    if (!sessionCookie) {
      return NextResponse.json({ isAuth: false }); // isAuth = false
    }

    // Подключаемся к базе данных
    const db = await getDB();
    // Ищем сессию в коллекции "session" по token = значению куки
    const session = await db.collection("session").findOne({ 
      token: sessionCookie // Ищем сессию с соответствующим токеном
    });

    // Проверяем: есть ли сессия И не истекла ли она
    const isAuth = !!session && new Date(session.expiresAt) > new Date();
    // !!session - преобразует в boolean (true если сессия существует)
    // new Date(session.expiresAt) > new Date() - проверяет что дата истечения еще не наступила
    
    // Возвращаем JSON ответ с статусом авторизации
    return NextResponse.json({ isAuth });

  } catch {
    // В случае ЛЮБОЙ ошибки возвращаем что пользователь не авторизован
    return NextResponse.json({ isAuth: false });
  }
}