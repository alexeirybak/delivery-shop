export const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    pending: "В процессе",
    confirmed: "Получен",
    failed: "Не доставили",
    cancelled: "Возврат",
  };
  return statusMap[status] || status;
};
