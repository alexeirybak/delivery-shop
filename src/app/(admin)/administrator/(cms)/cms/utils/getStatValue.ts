export const getStatValue = (statTitle: string, keywordsCount: string) => {
  switch (statTitle) {
    case "Категорий":
      return "0";
    case "Ключевых слов":
      return keywordsCount.toString();
    case "Опубликовано":
      return "0";
    case "Просмотров":
      return "0";
    default:
      return "0";
  }
};
