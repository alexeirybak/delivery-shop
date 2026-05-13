export const getStatusClass = (status?: string): string => {
  const map: Record<string, string> = {
    готово: "ready",
    "в работе": "pending",
    ошибка: "error",
  };
  return map[status || ""] || "ready";
};
