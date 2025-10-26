export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);

  return date
    .toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".");
};

export const getStatusText = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    pending: "В процессе",
    confirmed: "Получен",
    failed: "Не доставили",
    cancelled: "Возврат",
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-[#f3f2f1]";
    case "confirmed":
      return "bg-primary text-white";
    case "failed":
    case "cancelled":
      return "bg-[#d80000] text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
