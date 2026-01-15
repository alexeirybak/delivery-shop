export const getButtonColor = (color: string): string => {
  const colors: Record<string, string> = {
    blue: "bg-green-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    indigo: "bg-indigo-600",
    orange: "bg-orange-600",
  };
  return colors[color] || "bg-gray-600";
};
