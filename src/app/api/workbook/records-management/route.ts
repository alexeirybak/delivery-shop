import { getDB } from "@/lib/api-routes";
import { NextResponse } from "next/server";
import { Record } from "@/app/(user-part)/user-dashboard/(workbook)/records/types";
import { buildSortObject } from "./utils/buildSortObject";
import { buildFilterQuery } from "./utils/buildFilterQuery";
import { getAuthenticatedUserId } from "@/app/api/utils/getAuthenticatedUserId";
import { FilterType, SortField } from "@/app/(user-part)/user-dashboard/(workbook)/records-management/types";

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
    const validLimit = Math.max(1, Math.min(limit, 10000));

    const sortObject = buildSortObject(sortBy, sortOrder);
    
    let filterQuery = { userId };
    
    const additionalFilters = buildFilterQuery(search, filterBy);
    filterQuery = { ...filterQuery, ...additionalFilters };

    const skip = (validPage - 1) * validLimit;

    const records = await db
      .collection<Record>("records")
      .find(filterQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(validLimit)
      .toArray();

    const totalInDB = await db
      .collection<Record>("records")
      .countDocuments({ userId });

    const totalFiltered = await db
      .collection<Record>("records")
      .countDocuments(filterQuery);

    const totalPages = Math.ceil(totalFiltered / validLimit);

    const response = {
      success: true,
      data: {
        records: records.map((record) => ({
          ...record,
          _id: record._id.toString(),
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
  } catch (error) {
    console.error("Ошибка получения записей:", error);
    
    if (error instanceof Error && error.message === "Не авторизован") {
      return NextResponse.json(
        { success: false, message: "Не авторизован" },
        { status: 401 },
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка получения записей",
      },
      { status: 500 },
    );
  }
}