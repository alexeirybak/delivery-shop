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

    console.log("Фильтр", filterQuery, "Сортировка", sortBy, sortOrder);

    // Если сортировка по статьям, используем агрегацию
    if (sortBy === "articles") {
      const order = sortOrder === "asc" ? 1 : -1;

      // Типизированный пайплайн агрегации
      type AggregationStage =
        | { $match: object }
        | { $lookup: object }
        | { $addFields: object }
        | { $sort: object }
        | { $skip: number }
        | { $limit: number }
        | { $project: object };

      const aggregationPipeline: AggregationStage[] = [
        { $match: filterQuery },
        {
          $lookup: {
            from: "articles",
            let: { categoryId: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$categoryId", "$$categoryId"],
                  },
                },
              },
            ],
            as: "categoryArticles",
          },
        },
        {
          $addFields: {
            articlesCount: { $size: "$categoryArticles" },
          },
        },
        { $sort: { articlesCount: order } },
        { $skip: skip },
        { $limit: validLimit },
        {
          $project: {
            categoryArticles: 0,
          },
        },
      ];

      const categories = await db
        .collection<Category>("article-category")
        .aggregate(aggregationPipeline)
        .toArray();

      const totalInDB = await db
        .collection<Category>("article-category")
        .countDocuments({});

      const totalFiltered = await db
        .collection<Category>("article-category")
        .countDocuments(filterQuery);

      const totalPages = Math.ceil(totalFiltered / validLimit);

      const response = {
        success: true,
        data: {
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

      return NextResponse.json(response);
    }

    // Для остальных видов сортировки
    const sortObject = buildSortObject(sortBy, sortOrder);

    const categories = await db
      .collection<Category>("article-category")
      .find(filterQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(validLimit)
      .toArray();

    // Получаем ID категорий для подсчета статей
    const categoryIds = categories.map((cat) => cat._id.toString());

    // Считаем статьи для каждой категории
    const articlesCounts: Record<string, number> = {};

    if (categoryIds.length > 0) {
      const counts = await db
        .collection("articles")
        .aggregate<{ _id: string; count: number }>([
          {
            $match: {
              categoryId: { $in: categoryIds },
            },
          },
          {
            $group: {
              _id: "$categoryId",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();

      counts.forEach((item) => {
        articlesCounts[item._id] = item.count;
      });
    }

    // Добавляем articlesCount к каждой категории
    const categoriesWithCounts = categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
      articlesCount: articlesCounts[cat._id.toString()] || 0,
    }));

    const totalInDB = await db
      .collection<Category>("article-category")
      .countDocuments({});

    const totalFiltered = await db
      .collection<Category>("article-category")
      .countDocuments(filterQuery);

    const totalPages = Math.ceil(totalFiltered / validLimit);

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

    return NextResponse.json(response);
  } catch (error) {
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

export async function POST(request: Request) {
  try {
    const data: Category = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Название категории обязательно" },
        { status: 400 },
      );
    }

    if (!data.slug?.trim()) {
      return NextResponse.json(
        { success: false, message: "Алиас (slug) категории обязателен" },
        { status: 400 },
      );
    }

    const name = data.name.trim();
    const slug = data.slug.trim().toLowerCase();

    const db = await getDB();

    const existingCategory = await db
      .collection<Category>("article-category")
      .findOne({ slug });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Категория с таким алиасом уже существует" },
        { status: 400 },
      );
    }

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

    let maxNumericId = 0;
    if (
      result.length > 0 &&
      result[0].maxNumericId !== null &&
      result[0].maxNumericId !== undefined
    ) {
      maxNumericId = result[0].maxNumericId;
    }

    const newNumericId = maxNumericId + 1;

    const newCategory = {
      _id: new ObjectId(),
      numericId: newNumericId,
      name,
      slug,
      description: data.description?.trim() || "",
      keywords: data.keywords || [],
      image: data.image || "",
      imageAlt: data.imageAlt || name,
      author: data.author || "Неизвестен",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("article-category").insertOne(newCategory);

    const responseCategory: Category = {
      ...newCategory,
      _id: newCategory._id.toString(),
    };

    return NextResponse.json({
      success: true,
      message: "Категория создана",
      data: responseCategory,
    });
  } catch (error) {
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
