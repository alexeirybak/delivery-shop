export const getFilterLabel = (filterType: string): string => {
  const labels = {
    all: "Все карты",
    active: "Активные",
    inactive: "Неактивные",
    free: "Свободные",
    assigned: "Привязанные",
  };
  return labels[filterType as keyof typeof labels] || filterType;
};
