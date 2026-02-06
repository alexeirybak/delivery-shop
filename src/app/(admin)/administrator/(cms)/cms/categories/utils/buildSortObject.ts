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
    case "createdAt":
      return { createdAt: sortDirection };
    case "author":
      return { author: sortDirection };
    case "articles":
      return { articlesCount: sortDirection };
    default:
      return { numericId: sortDirection };
  }
};
