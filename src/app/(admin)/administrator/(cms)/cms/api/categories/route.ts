import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "../../../../../../../../utils/api-routes";
import { Category, FilterType, SortField } from "../../types/categories";
import { buildFilterQuery } from "../../utils/buildFilterQuery";
import { buildSortObject } from "../../utils/buildSortObject";


export async function GET(request: Request) {
  try {
    const db = await getDB();
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const filterBy: FilterType = (searchParams.get("filterBy") ||
      "all") as FilterType;
    const sortBy: SortField = (searchParams.get("sortBy") ||
      "numericId") as SortField;
    const sortOrder = searchParams.get("sortOrder") || "asc";

    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(limit, 100));

    const filterQuery = buildFilterQuery(search, filterBy);

    const sortObject = buildSortObject(sortBy, sortOrder);

    const skip = (validPage - 1) * validLimit;

    const totalInDB = await db
      .collection<Category>("article-category")
      .countDocuments({});

    const totalFiltered = await db
      .collection<Category>("article-category")
      .countDocuments(filterQuery);

    const categories = await db
      .collection<Category>("article-category")
      .find(filterQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(validLimit)
      .toArray();

    const totalPages = Math.ceil(totalFiltered / validLimit);

    const response = {
      success: true,
      data: {
        categories: categories.map((cat) => ({
          ...cat,
          _id: cat._id.toString(),
        })),
        pagination: {
          page: validPage,
          limit: validLimit,
          total: totalFiltered,
          totalAll: totalInDB,
          totalPages,
          hasNextPage: validPage < totalPages,
          hasPrevPage: validPage > 1,
        },
        filters: {
          search,
          filterBy,
          sortBy,
          sortOrder,
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
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data: Category = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Название категории обязательно" },
        { status: 400 }
      );
    }

    if (!data.slug?.trim()) {
      return NextResponse.json(
        { success: false, message: "Алиас (slug) категории обязателен" },
        { status: 400 }
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
        { status: 400 }
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

    // Создаем объект с ObjectId, а потом преобразуем в строку для ответа
    const newCategory = {
      _id: new ObjectId(),
      numericId: newNumericId,
      name,
      slug,
      description: data.description?.trim() || "",
      keywords: data.keywords || [],
      image: data.image || "",
      imageAlt: data.imageAlt || "",
      author: data.author || "Неизвестен",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // MongoDB примет ObjectId без проблем
    await db.collection("article-category").insertOne(newCategory);

    // Преобразуем ObjectId в строку для ответа
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
      { status: 500 }
    );
  }
}