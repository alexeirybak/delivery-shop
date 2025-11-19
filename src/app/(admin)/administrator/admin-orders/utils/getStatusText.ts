import { Order } from "@/types/order";

  export const getStatusText = (status: Order["status"]): string => {
    switch (status) {
      case "pending":
        return "В обработке";
      case "confirmed":
        return "Подтвержден";
      case "cancelled":
        return "Отменен";
      case "delivered":
        return "Доставлен";
      case "failed":
        return "Неудачный";
      default:
        return status;
    }
  };