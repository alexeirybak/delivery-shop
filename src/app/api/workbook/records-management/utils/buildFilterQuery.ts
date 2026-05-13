import { FilterType } from "@/app/(user-part)/user-dashboard/(workbook)/records-management/types";

export const buildFilterQuery = (searchQuery: string, filterBy: FilterType) => {
  if (!searchQuery.trim()) return {};

  const query = searchQuery.toLowerCase().trim();
  const regexCondition = { $regex: query, $options: "i" };

  switch (filterBy) {
    case "name":
      return { name: regexCondition };
    case "content":
      return { content: regexCondition };
    case "description":
      return { description: regexCondition };
    case "categoryName":
      return { categoryName: regexCondition };
    case "all":
    default:
      return {
        $or: [
          { name: regexCondition },
          { content: regexCondition },
          { description: regexCondition },
          { categoryName: regexCondition },
        ],
      };
  }
};
