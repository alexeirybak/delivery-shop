import { SortField } from "@/app/(user-part)/user-dashboard/(workbook)/records-management/types";

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
    case "categoryName":
      return { categoryName: sortDirection };
    case "isFeatured":
      return { isFeatured: sortDirection };
    case "createdAt":
      return { createdAt: sortDirection };
    default:
      return { numericId: sortDirection };
  }
};