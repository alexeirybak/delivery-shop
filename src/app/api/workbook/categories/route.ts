import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/api-routes";
import { buildFilterQuery } from "@/app/(user-part)/user-dashboard/(workbook)/categories/utils/buildFilterQuery";
import { buildSortObject } from "@/app/(user-part)/user-dashboard/(workbook)/categories/utils/buildSortObject";
import {
  FilterType,
  SortField,
} from "@/app/(user-part)/user-dashboard/(workbook)/categories/types";
import { Category } from "@/app/(user-part)/user-dashboard/(workbook)/records/types/categories/categories.types";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";

export async function GET(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
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
    const userFilterQuery = { ...filterQuery, userId };
    const skip = (validPage - 1) * validLimit;

    const [totalFiltered, totalAllItems] = await Promise.all([
      db
        .collection<Category>("records-category")
        .countDocuments(userFilterQuery),
      db.collection<Category>("records-category").countDocuments({ userId }),
    ]);

    if (sortBy === "records") {
      const order = sortOrder === "asc" ? 1 : -1;
      const aggregationPipeline = [
        { $match: userFilterQuery },
        {
          $lookup: {
            from: "records",
            let: { categoryId: { $toString: "$_id" } },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$categoryId", { $toString: "$$categoryId" }] },
                      { $eq: ["$userId", userId] },
                    ],
                  },
                },
              },
            ],
            as: "categoryRecords",
          },
        },
        { $addFields: { recordsCount: { $size: "$categoryRecords" } } },
        { $sort: { recordsCount: order } },
        { $skip: skip },
        { $limit: validLimit },
        { $project: { categoryRecords: 0 } },
      ];

      const categories = await db
        .collection<Category>("records-category")
        .aggregate(aggregationPipeline)
        .toArray();

      return NextResponse.json({
        success: true,
        data: {
          categories: categories.map((cat) => ({
            ...cat,
            _id: cat._id.toString(),
            recordsCount:
              (cat as Category & { recordsCount: number }).recordsCount || 0,
          })),
          pagination: {
            page: validPage,
            limit: validLimit,
            total: totalFiltered,
            totalAllItems,
            totalPages: Math.ceil(totalFiltered / validLimit),
          },
        },
      });
    }

    const sortObject = buildSortObject(sortBy, sortOrder);
    const categories = await db
      .collection<Category>("records-category")
      .find(userFilterQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(validLimit)
      .toArray();

    const recordsCounts: Record<string, number> = {};
    if (categories.length > 0) {
      const categoryIds = categories.map((cat) => cat._id.toString());
      const counts = await db
        .collection("records")
        .aggregate<{ _id: string; count: number }>([
          {
            $match: {
              categoryId: { $in: categoryIds },
              userId,
            },
          },
          { $group: { _id: "$categoryId", count: { $sum: 1 } } },
        ])
        .toArray();

      counts.forEach((item) => {
        recordsCounts[item._id] = item.count;
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        categories: categories.map((cat) => ({
          ...cat,
          _id: cat._id.toString(),
          recordsCount: recordsCounts[cat._id.toString()] || 0,
        })),
        pagination: {
          page: validPage,
          limit: validLimit,
          total: totalFiltered,
          totalAllItems,
          totalPages: Math.ceil(totalFiltered / validLimit),
        },
      },
    });
  } catch (error) {
    console.error("Ошибка получения тетради:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json(
        { success: false, message: "Не авторизован" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Ошибка получения тетрадей" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId(request.headers);
    const data: Category = await request.json();

    if (!data.name?.trim()) {
      return NextResponse.json(
        { success: false, message: "Название тетради обязательно" },
        { status: 400 },
      );
    }

    const name = data.name.trim();
    const db = await getDB();

    const existingCategory = await db
      .collection<Category>("records-category")
      .findOne({ userId, name });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Тетрадь с таким именем уже существует" },
        { status: 400 },
      );
    }

    const result = await db
      .collection("records-category")
      .aggregate([
        { $match: { userId } },
        { $group: { _id: null, maxNumericId: { $max: "$numericId" } } },
      ])
      .toArray();

    const maxNumericId = result[0]?.maxNumericId ?? 0;
    const newNumericId = maxNumericId + 1;

    const newCategory = {
      _id: new ObjectId(),
      userId,
      numericId: newNumericId,
      name,
      description: data.description?.trim() || "",
      image: data.image || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection("records-category").insertOne(newCategory);

    return NextResponse.json({
      success: true,
      message: "Тетрадь создана",
      data: {
        ...newCategory,
        _id: newCategory._id.toString(),
      },
    });
  } catch (error) {
    console.error("Ошибка создания тетради:", error);

    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json(
        { success: false, message: "Не авторизован" },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Ошибка создания тетради",
        error: error instanceof Error ? error.message : "Неизвестная ошибка",
      },
      { status: 500 },
    );
  }
}
