export const getStatValue = (
  statTitle: string,
  categoriesCount: string,
  keywordsCount: string
) => {
  switch (statTitle) {
    case "Категорий":
      return categoriesCount;
    case "Ключевых слов":
      return keywordsCount;
    case "Опубликовано":
      return "0";
    case "Просмотров":
      return "0";
    default:
      return "0";
  }
};
