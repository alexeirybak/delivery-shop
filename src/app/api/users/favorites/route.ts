import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '../../../../../utils/api-routes';
import { ObjectId } from 'mongodb';

// Интерфейс для типизации документа пользователя в MongoDB
interface UserDocument {
  _id: ObjectId;          // Уникальный идентификатор документа
  favorites: string[];    // Массив ID избранных товаров
  updatedAt: Date;        // Дата последнего обновления
}

// GET - получение списка избранного
export async function GET(request: NextRequest) {
  try {
    // Создаем объект URL из запроса и получаем параметры строки запроса
    const { searchParams } = new URL(request.url);
    // Извлекаем userId из параметров запроса
    const userId = searchParams.get('userId');

    // Если userId не передан, возвращаем пустой массив избранного
    if (!userId) {
      return NextResponse.json({ favorites: [] });
    }

    // Получаем подключение к базе данных
    const db = await getDB();
    // Ищем пользователя по ID в коллекции 'user'
    const user = await db.collection<UserDocument>('user').findOne({ 
      _id: new ObjectId(userId)  // Преобразуем строку в ObjectId для поиска
    });

    // Возвращаем массив избранного пользователя или пустой массив, если пользователь не найден
    return NextResponse.json({ 
      favorites: user?.favorites || []  // Опциональная цепочка для безопасного доступа
    });

  } catch {
    // В случае любой ошибки возвращаем сообщение об ошибке с статусом 500
    return NextResponse.json(
      { error: 'Ошибка получения избранного' },
      { status: 500 }
    );
  }
}

// POST - добавление или удаление из избранного
export async function POST(request: NextRequest) {
  try {
    // Парсим JSON тело запроса и извлекаем параметры
    const { userId, productId, action } = await request.json();

    // Проверяем обязательные параметры
    if (!userId || !productId) {
      return NextResponse.json(
        { error: 'userId и productId обязательны' },
        { status: 400 }  // 400 - Bad Request
      );
    }

    // Получаем подключение к базе данных
    const db = await getDB();
    // Создаем ObjectId из строки userId (альтернативный способ создания ObjectId)
    const userObjectId = ObjectId.createFromHexString(userId);

    // Обработка действия "add" - добавление в избранное
    if (action === "add") {
      // Выполняем операцию обновления документа пользователя
      const result = await db.collection<UserDocument>('user').updateOne(
        // Условие поиска: находим пользователя по ID
        { _id: userObjectId },
        { 
          // 🔥 $addToSet - оператор MongoDB:
          // Добавляет значение в массив ТОЛЬКО если его там еще нет
          // Предотвращает дублирование элементов в массиве
          // Пример: 
          //   До: favorites = ["prod1", "prod2"]
          //   После добавления "prod3": favorites = ["prod1", "prod2", "prod3"]
          //   При повторном добавлении "prod3": массив не изменится
          $addToSet: { favorites: productId },
          
          // 🔥 $set - оператор MongoDB:
          // Устанавливает значение поля, перезаписывая существующее
          // Обновляет дату последнего изменения документа
          $set: { updatedAt: new Date() }
        }
      );

      // Проверяем, был ли найден пользователь для обновления
      // matchedCount показывает количество найденных документов
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
      }

      // Возвращаем успешный ответ
      return NextResponse.json({ success: true });
    }

    // Обработка действия "remove" - удаление из избранного
    if (action === "remove") {
      // Выполняем операцию обновления документа пользователя
      const result = await db.collection<UserDocument>('user').updateOne(
        // Условие поиска: находим пользователя по ID
        { _id: userObjectId },
        { 
          // 🔥 $pull - оператор MongoDB:
          // Удаляет все вхождения значения из массива
          // Удаляет productId из массива favorites, если он там присутствует
          // Пример:
          //   До: favorites = ["prod1", "prod2", "prod3"]
          //   После удаления "prod2": favorites = ["prod1", "prod3"]
          //   Если "prod2" нет в массиве - массив не изменится
          $pull: { favorites: productId },
          
          // Обновляем дату изменения документа
          $set: { updatedAt: new Date() }
        }
      );

      // Проверяем, был ли найден пользователь
      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
      }

      // Возвращаем успешный ответ
      return NextResponse.json({ success: true });
    }

    // Если действие не "add" и не "remove", возвращаем ошибку
    return NextResponse.json({ error: 'Неверное действие' }, { status: 400 });

  } catch {
    // В случае любой ошибки возвращаем сообщение об ошибке с статусом 500
    return NextResponse.json(
      { error: 'Ошибка изменения избранного' },
      { status: 500 }
    );
  }
}