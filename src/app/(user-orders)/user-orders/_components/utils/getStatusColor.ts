export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
    case "confirmed":
      return "bg-[#f3f2f1]";
    case "delivered":
      return "bg-primary text-white";
    case "cancelled":
      return "bg-[#d80000] text-white";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
