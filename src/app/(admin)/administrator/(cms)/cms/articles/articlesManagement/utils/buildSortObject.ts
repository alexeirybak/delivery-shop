import { SortField } from "../types";

export const buildSortObject = (
  sortBy: SortField,
  sortOrder: string,
): Record<string, 1 | -1> => {
  const sortDirection: 1 | -1 = sortOrder === "asc" ? 1 : -1;

  switch (sortBy) {
    case "numericId":
      return { numericId: sortDirection };
    case "name":
      return { name: sortDirection };
    case "slug":
      return { slug: sortDirection };
    case "categoryName":
      return { categoryName: sortDirection };
    case "isFeatured":
      return { isFeatured: sortDirection };
    case "status":
      return { status: sortDirection };
    case "author":
      return { author: sortDirection };
    case "createdAt":
      return { createdAt: sortDirection };
    case "views":
      return { views: sortDirection };
    default:
      return { numericId: sortDirection };
  }
};