import { CUSTOMER_STATUSES } from "./customerStatuses";

// Функция для получения английского статуса из русского лейбла
export const getEnglishStatus = (russianLabel: string): string => {
  const status = CUSTOMER_STATUSES.find(s => s.label === russianLabel);
  return status ? status.value : "pending";
};