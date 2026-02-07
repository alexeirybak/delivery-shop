import { NextResponse } from "next/server"; // Для создания HTTP-ответов в Next.js
import { getDB } from "../../../../../../../../utils/api-routes"; // Утилита для подключения к MongoDB
import { buildSortObject } from "../../categories/utils/buildSortObject"; // Функция для построения объекта сортировки
import { buildFilterQuery } from "../../categories/utils/buildFilterQuery"; // Функция для построения запроса фильтрации
import { Category, FilterType, SortField } from "../../categories/types"; // TypeScript типы

export async function GET(request: Request) {
  try {
    const db = await getDB();
    
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("pageToLoad") || "1");
    const limit = parseInt(searchParams.get("limit")!);
    const sortBy: SortField = (searchParams.get("sortBy") || "numericId") as SortField;
    const sortOrder = searchParams.get("sortOrder") || "asc";
    const search = searchParams.get("search") || "";
    const filterBy: FilterType = (searchParams.get("filterBy") || "all") as FilterType;

    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(limit, 100));
    const skip = (validPage - 1) * validLimit;

    const filterQuery = buildFilterQuery(search, filterBy);

    if (sortBy === "articles") {
      const order = sortOrder === "asc" ? 1 : -1;

      const allCategoriesAggregation = [
        { $match: filterQuery },
        {
          $lookup: {
            from: "articles", 
            let: { categoryId: { $toString: "$_id" } }, 
            pipeline: [ 
              {
                $match: { // Фильтруем статьи по categoryId
                  $expr: { $eq: ["$categoryId", "$$categoryId"] },
                },
              },
            ],
            as: "categoryArticles", // Сохраняем результат в это поле
          },
        },
        // 3. Этап добавления полей: подсчитываем количество статей
        {
          $addFields: {
            // $size считает количество элементов в массиве categoryArticles
            articlesCount: { $size: "$categoryArticles" },
          },
        },
        // 4. Этап проекции: выбираем только нужные поля
        {
          $project: {
            _id: 1, // Включаем поле _id
            numericId: 1, // Включаем numericId
            name: 1, // Включаем название
            slug: 1, // Включаем slug
            description: 1, // Включаем описание
            keywords: 1, // Включаем ключевые слова
            image: 1, // Включаем изображение
            imageAlt: 1, // Включаем alt для изображения
            author: 1, // Включаем автора
            createdAt: 1, // Включаем дату создания
            updatedAt: 1, // Включаем дату обновления
            articlesCount: 1, // Включаем подсчитанное количество статей
            // Неявно исключаем categoryArticles (массив статей больше не нужен)
          },
        },
      ];

      // Выполняем агрегацию для получения ВСЕХ категорий с подсчитанными статьями
      const allCategories = await db
        .collection<Category>("article-category") // Указываем коллекцию и тип
        .aggregate(allCategoriesAggregation) // Применяем агрегационный конвейер
        .toArray(); // Преобразуем результат в массив

      // Сортируем категории в JavaScript по количеству статей
      const sortedCategories = allCategories.sort((a, b) => {
        // Получаем количество статей у каждой категории (по умолчанию 0)
        const countA = a.articlesCount || 0;
        const countB = b.articlesCount || 0;
        // Сортируем в зависимости от направления
        return order === 1 ? countA - countB : countB - countA;
      });

      // Подсчитываем общее количество отфильтрованных категорий
      const totalFiltered = sortedCategories.length;
      // Рассчитываем общее количество страниц
      const totalPages = Math.ceil(totalFiltered / validLimit);

      // Применяем пагинацию: берем только нужную часть массива
      const paginatedCategories = sortedCategories.slice(skip, skip + validLimit);

      // Получаем общее количество категорий в базе данных (без фильтров)
      const totalInDB = await db
        .collection<Category>("article-category")
        .countDocuments({});

      // Формируем структуру ответа
      const response = {
        success: true, // Флаг успешного выполнения
        data: {
          // Преобразуем категории: конвертируем ObjectId в строку
          categories: paginatedCategories.map((cat) => ({
            ...cat, // Копируем все свойства категории
            _id: cat._id.toString(), // Конвертируем ObjectId в строку
          })),
          totalInDB, // Общее количество категорий в БД
          pagination: { // Информация о пагинации
            page: validPage, // Текущая страница
            limit: validLimit, // Лимит на страницу
            total: totalFiltered, // Количество отфильтрованных записей
            totalAll: totalInDB, // Общее количество записей в БД
            totalPages, // Общее количество страниц
          },
        },
      };

      // Возвращаем успешный ответ в формате JSON
      return NextResponse.json(response);
    }

    // Если сортировка НЕ по количеству статей:
    
    // Строим объект сортировки для MongoDB
    const sortObject = buildSortObject(sortBy, sortOrder);

    // Получаем категории с пагинацией (обычный запрос, без агрегации)
    const categories = await db
      .collection<Category>("article-category")
      .find(filterQuery) // Применяем фильтр
      .sort(sortObject) // Применяем сортировку
      .skip(skip) // Пропускаем записи для пагинации
      .limit(validLimit) // Ограничиваем количество результатов
      .toArray(); // Преобразуем в массив

    // Собираем ID всех полученных категорий для подсчета статей
    const categoryIds = categories.map((cat) => cat._id.toString());
    
    // Создаем объект для хранения количества статей по categoryId
    const articlesCounts: Record<string, number> = {};

    // Если есть категории, подсчитываем статьи для них
    if (categoryIds.length > 0) {
      // Используем агрегацию для подсчета статей в каждой категории
      const counts = await db
        .collection("articles")
        .aggregate<{ _id: string; count: number }>([
          // Фильтруем статьи по ID категорий
          {
            $match: {
              categoryId: { $in: categoryIds }, // Статьи, относящиеся к нашим категориям
            },
          },
          // Группируем по categoryId и подсчитываем количество
          {
            $group: {
              _id: "$categoryId", // Группируем по полю categoryId
              count: { $sum: 1 }, // Считаем количество статей в каждой группе
            },
          },
        ])
        .toArray();

      // Преобразуем результат агрегации в объект для быстрого доступа
      counts.forEach((item) => {
        articlesCounts[item._id] = item.count; // Сохраняем количество по ID категории
      });
    }

    // Объединяем данные категорий с количеством статей
    const categoriesWithCounts = categories.map((cat) => ({
      ...cat, // Копируем все свойства категории
      _id: cat._id.toString(), // Конвертируем ObjectId в строку
      // Добавляем количество статей (0 если категория не найдена в articlesCounts)
      articlesCount: articlesCounts[cat._id.toString()] || 0,
    }));

    // Подсчитываем общее количество категорий в базе данных
    const totalInDB = await db
      .collection<Category>("article-category")
      .countDocuments({});

    // Подсчитываем количество отфильтрованных категорий
    const totalFiltered = await db
      .collection<Category>("article-category")
      .countDocuments(filterQuery);

    // Рассчитываем общее количество страниц
    const totalPages = Math.ceil(totalFiltered / validLimit);

    // Формируем финальный ответ
    const response = {
      success: true,
      data: {
        categories: categoriesWithCounts, // Категории с количеством статей
        totalInDB, // Общее количество категорий в БД
        pagination: { // Информация о пагинации
          page: validPage,
          limit: validLimit,
          total: totalFiltered,
          totalAll: totalInDB,
          totalPages,
        },
      },
    };

    // Возвращаем успешный ответ
    return NextResponse.json(response);
  } catch (error) {
    // Обработка ошибок
    console.error("Ошибка получения категорий:", error);
    
    // Возвращаем ошибку сервера
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка получения категорий",
      },
      { status: 500 }, // HTTP статус 500 - Internal Server Error
    );
  }
}