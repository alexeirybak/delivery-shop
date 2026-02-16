export const getStatusText = (currentStepName: string) => {
  switch (status) {
    case "generating":
      return "Запуск генерации...";
    case "loading":
      return `Генерация ${currentStepName}...`;
    case "success":
      return "Генерация завершена!";
    case "error":
      return "Ошибка генерации";
    default:
      return "Ожидание...";
  }
};
