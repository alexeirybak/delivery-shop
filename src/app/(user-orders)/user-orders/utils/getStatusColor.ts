import { Order } from "@/types/order";
 
export const getStatusColor = (order: Order) => {
  if (order.paymentMethod === "online") {
    if (order.paymentStatus === "paid" && order.status === "confirmed") {
      return "bg-[#f3f2f1]";
    } else if (order.paymentStatus === "failed") {
      return "bg-[#d80000] text-white";
    } else if (
      order.paymentStatus === "waiting" &&
      order.status === "pending"
    ) {
      return "bg-[#f3f2f1] text-main-text";
    }
  }
 
  if (order.paymentMethod === "cash_on_delivery") {
    if (order.status === "pending" && order.paymentStatus === "pending") {
      return "bg-[#e6f7ee] text-[#067647]";
    } else if (order.status === "confirmed") {
      return "bg-[#f3f2f1]";
    }
  }
 
  switch (order.status) {
    case "pending":
    case "confirmed":
      return "bg-[#f3f2f1]";
    case "delivered":
      return "bg-[#067647] text-white";
    case "cancelled":
    case "failed":
      return "bg-[#d80000] text-white";
    case "refund":
    case "returned":
      return "bg-[#fff9e6] text-[#b35c00]";
    case "collected":
      return "bg-[#e6f7ee] text-[#067647]";
    case "delivering":
      return "bg-[#e6f7ee] text-[#067647]";
    default:
      return "bg-[#f3f2f1] text-gray-800";
  }
};