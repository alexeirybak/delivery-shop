export const getGenreName = (mode: string): string => {
  switch (mode) {
    case "textbooks":
      return "Учебник";
    case "coursework":
      return "Курсовая работа";
    case "report":
      return "Реферат";
    case "thesis":
      return "Выпускная квалификационная работа (ВКР)";
    default:
      return mode;
  }
};
