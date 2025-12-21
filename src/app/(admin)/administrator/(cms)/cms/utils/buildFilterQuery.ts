import { FilterType } from "../types";

export const buildFilterQuery = (searchQuery: string, filterBy: FilterType) => {
  if (!searchQuery.trim()) return {};

  const query = searchQuery.toLowerCase().trim();
  const regexCondition = { $regex: query, $options: "i" };

  switch (filterBy) {
    case "name":
      return { name: regexCondition };

    case "slug":
      return { slug: regexCondition };

    case "description":
      return { description: regexCondition };

    case "keywords":
      return { keywords: { $elemMatch: regexCondition } };

    case "author":
      return { author: regexCondition };

    case "all":
    default:
      return {
        $or: [
          { name: regexCondition },
          { slug: regexCondition },
          { description: regexCondition },
          { keywords: { $elemMatch: regexCondition } },
          { author: regexCondition },
        ],
      };
  }
};
