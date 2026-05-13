import { FilterType } from "../types";

export const buildFilterQuery = (searchQuery: string, filterBy: FilterType) => {
  if (!searchQuery.trim()) return {};

  const query = searchQuery.toLowerCase().trim();
  const regexCondition = { $regex: query, $options: "i" };

  switch (filterBy) {
    case "name":
      return { name: regexCondition };

    case "description":
      return { description: regexCondition };

    case "all":
    default:
      return {
        $or: [
          { name: regexCondition },
          { description: regexCondition },
        ],
      };
  }
};
