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
