export const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    pending: "В процессе",
    confirmed: "В процессе",
    delivered: "Получен",
    cancelled: "Возврат",
    failed: "Не доставили",
  };
  return statusMap[status] || status;
};
