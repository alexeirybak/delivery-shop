export const getTextColor = (color: string): string => {
  const colors: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    indigo: "text-indigo-600",
    orange: "text-orange-600",
  };
  return colors[color] || "text-gray-600";
};
