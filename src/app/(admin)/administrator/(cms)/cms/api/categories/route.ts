import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../utils/api-routes";
import { buildSortObject } from "../../categories/utils/buildSortObject";
import { buildFilterQuery } from "../../categories/utils/buildFilterQuery";
import { Category, FilterType, SortField } from "../../categories/types";

export async function GET(request: Request) {
  try {
    const db = await getDB();

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("pageToLoad") || "1");
    const limit = parseInt(searchParams.get("limit")!);

    const sortBy: SortField = (searchParams.get("sortBy") ||
      "numericId") as SortField;
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const search = searchParams.get("search") || "";

    const filterBy: FilterType = (searchParams.get("filterBy") ||
      "all") as FilterType;

    const validPage = Math.max(1, page);

    const validLimit = Math.max(1, Math.min(limit, 100));

    const filterQuery = buildFilterQuery(search, filterBy);

    const skip = (validPage - 1) * validLimit;

    if (sortBy === "articles") {
      const order = sortOrder === "asc" ? 1 : -1;

      const aggregationPipeline = [
        // Этап 1: Фильтрация документов
        { $match: filterQuery },
        // Этап 2: Объединение с коллекцией статей
        {
          $lookup: {
            from: "articles", // Коллекция для объединения
            let: { categoryId: { $toString: "$_id" } }, // Конвертация _id в строку
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      "$categoryId", // строка в коллекции articles
                      { $toString: "$$categoryId" }, // конвертируем ObjectId в строку
                    ],
                  },
                },
              },
            ],
            as: "categoryArticles", // Имя поля для результатов
          },
        },
        // Этап 3: Добавление поля с количеством статей
        {
          $addFields: {
            articlesCount: { $size: "$categoryArticles" },
          },
        },
        // Этап 4: Сортировка по количеству статей
        { $sort: { articlesCount: order } },
        // Этап 5: Пагинация - пропуск документов
        { $skip: skip },
        // Этап 6: Пагинация - ограничение количества
        { $limit: validLimit },
        // Этап 7: Исключение временного поля
        {
          $project: {
            categoryArticles: 0,
          },
        },
      ];

      // Выполнение агрегации для получения категорий
      const categories = await db
        .collection<Category>("article-category")
        .aggregate(aggregationPipeline)
        .toArray();

      // Подсчет общего количества категорий в базе
      const totalInDB = await db
        .collection<Category>("article-category")
        .countDocuments({});

      // Подсчет количества отфильтрованных категорий
      const totalFiltered = await db
        .collection<Category>("article-category")
        .countDocuments(filterQuery);

      // Расчет общего количества страниц
      const totalPages = Math.ceil(totalFiltered / validLimit);

      // Формирование ответа
      const response = {
        success: true,
        data: {
          // Преобразование категорий с конвертацией _id в строку
          categories: categories.map((cat) => ({
            ...cat,
            _id: cat._id.toString(),
            articlesCount:
              (cat as Category & { articlesCount: number }).articlesCount || 0,
          })),
          totalInDB,
          pagination: {
            page: validPage,
            limit: validLimit,
            total: totalFiltered,
            totalAll: totalInDB,
            totalPages,
          },
        },
      };

      // Возврат успешного ответа в формате JSON
      return NextResponse.json(response);
    }

    // Для других типов сортировки (не по статьям)
    // Создание объекта для сортировки
    const sortObject = buildSortObject(sortBy, sortOrder);

    // Получение категорий с применением фильтрации, сортировки и пагинации
    const categories = await db
      .collection<Category>("article-category")
      .find(filterQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(validLimit)
      .toArray();

    // Извлечение ID категорий для подсчета статей
    const categoryIds = categories.map((cat) => cat._id.toString());

    // Объект для хранения количества статей по категориям
    const articlesCounts: Record<string, number> = {};

    // Подсчет статей только если есть категории
    if (categoryIds.length > 0) {
      const counts = await db
        .collection("articles")
        .aggregate<{ _id: string; count: number }>([
          // Фильтрация статей по ID категорий
          {
            $match: {
              categoryId: { $in: categoryIds },
            },
          },
          // Группировка по categoryId с подсчетом количества
          {
            $group: {
              _id: "$categoryId",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();

      // Заполнение объекта articlesCounts
      counts.forEach((item) => {
        articlesCounts[item._id] = item.count;
      });
    }

    // Добавление количества статей к каждой категории
    const categoriesWithCounts = categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
      articlesCount: articlesCounts[cat._id.toString()] || 0,
    }));

    // Подсчет общего количества категорий
    const totalInDB = await db
      .collection<Category>("article-category")
      .countDocuments({});

    // Подсчет количества отфильтрованных категорий
    const totalFiltered = await db
      .collection<Category>("article-category")
      .countDocuments(filterQuery);

    // Расчет общего количества страниц
    const totalPages = Math.ceil(totalFiltered / validLimit);

    // Формирование финального ответа
    const response = {
      success: true,
      data: {
        categories: categoriesWithCounts,
        totalInDB,
        pagination: {
          page: validPage,
          limit: validLimit,
          total: totalFiltered,
          totalAll: totalInDB,
          totalPages,
        },
      },
    };

    // Возврат ответа
    return NextResponse.json(response);
  } catch (error) {
    // Обработка ошибок с логированием и возвратом ошибки 500
    console.error("Ошибка получения категорий:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка получения категорий",
      },
      { status: 500 },
    );
  }
}

// Экспорт асинхронной функции POST для обработки POST-запросов (создание категории)
export async function POST(request: Request) {
  try {
    // Получение данных из тела запроса
    const data: Category = await request.json();

    // Валидация: проверка наличия названия категории
    if (!data.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Название категории обязательно" },
        { status: 400 },
      );
    }

    // Валидация: проверка наличия slug (алиаса)
    if (!data.slug?.trim()) {
      return NextResponse.json(
        { success: false, message: "Алиас (slug) категории обязателен" },
        { status: 400 },
      );
    }

    // Очистка и нормализация данных
    const name = data.name.trim();
    const slug = data.slug.trim().toLowerCase();

    // Подключение к базе данных
    const db = await getDB();

    // Проверка на уникальность slug
    const existingCategory = await db
      .collection<Category>("article-category")
      .findOne({ slug });

    // Если категория с таким slug уже существует
    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Категория с таким алиасом уже существует" },
        { status: 400 },
      );
    }

    // Получение максимального значения numericId для генерации следующего
    const result = await db
      .collection("article-category")
      .aggregate([
        {
          $group: {
            _id: null,
            maxNumericId: { $max: "$numericId" },
          },
        },
      ])
      .toArray();

    // Инициализация максимального ID
    let maxNumericId = 0;

    // Проверка наличия результата и корректности значения
    if (
      result.length > 0 &&
      result[0].maxNumericId !== null &&
      result[0].maxNumericId !== undefined
    ) {
      maxNumericId = result[0].maxNumericId;
    }

    // Генерация нового numericId
    const newNumericId = maxNumericId + 1;

    // Создание объекта новой категории
    const newCategory = {
      _id: new ObjectId(), // Генерация уникального идентификатора MongoDB
      numericId: newNumericId, // Уникальный числовой идентификатор
      name,
      slug,
      description: data.description?.trim() || "", // Очистка описания
      keywords: data.keywords || [], // Ключевые слова или пустой массив
      image: data.image || "", // URL изображения
      imageAlt: data.imageAlt || name, // Alt текст для изображения
      author: data.author || "Неизвестен", // Автор или значение по умолчанию
      createdAt: new Date().toISOString(), // Время создания в ISO формате
      updatedAt: new Date().toISOString(), // Время обновления
    };

    // Вставка новой категории в базу данных
    await db.collection("article-category").insertOne(newCategory);

    // Создание ответной категории с преобразованием _id в строку
    const responseCategory: Category = {
      ...newCategory,
      _id: newCategory._id.toString(),
    };

    // Возврат успешного ответа
    return NextResponse.json({
      success: true,
      message: "Категория создана",
      data: responseCategory,
    });
  } catch (error) {
    // Обработка ошибок с логированием
    console.error("Ошибка создания категории:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка создания категории",
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 },
    );
  }
}
