import { NextResponse } from "next/server";
import {
  Article,
  FilterType,
  SortField,
} from "../../../articles/articlesManagement/types";
import { getDB } from "../../../../../../../../../utils/api-routes";
import { buildSortObject } from "../../../articles/articlesManagement/utils/buildSortObject";
import { buildFilterQuery } from "../../../articles/articlesManagement/utils/buildFilterQuery";

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
    const validLimit = Math.max(1, Math.min(limit, 10000));

    const sortObject = buildSortObject(sortBy, sortOrder);
    const filterQuery = buildFilterQuery(search, filterBy);

    const skip = (validPage - 1) * validLimit;

    const articles = await db
      .collection<Article>("articles")
      .find(filterQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(validLimit)
      .toArray();

    const totalInDB = await db
      .collection<Article>("articles")
      .countDocuments({});

    const totalFiltered = await db
      .collection<Article>("articles")
      .countDocuments(filterQuery);

    const totalPages = Math.ceil(totalFiltered / validLimit);

    const response = {
      success: true,
      data: {
        articles: articles.map((article) => ({
          ...article,
          _id: article._id.toString(),
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
    console.error("Ошибка получения статей:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Ошибка получения статей",
      },
      { status: 500 },
    );
  }
}