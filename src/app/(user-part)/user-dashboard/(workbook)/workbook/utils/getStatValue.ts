export const getStatValue = (
  statTitle: string,
  categoriesCount: string,
  recordsCount: string,
) => {
  switch (statTitle) {
    case "Тетрадей":
      return categoriesCount;
    case "Создано записей":
      return recordsCount;
    default:
      return "0";
  }
};
