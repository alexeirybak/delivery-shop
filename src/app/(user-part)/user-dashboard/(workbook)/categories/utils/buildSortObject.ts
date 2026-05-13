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
    case "createdAt":
      return { createdAt: sortDirection };
    case "records":
      return { recordsCount: sortDirection };
    default:
      return { numericId: sortDirection };
  }
};
