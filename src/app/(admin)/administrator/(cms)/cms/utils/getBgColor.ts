export const getBgColor = (color: string): string => {
  const colors: Record<string, string> = {
    blue: "bg-blue-100",
    green: "bg-green-100",
    purple: "bg-purple-100",
    indigo: "bg-indigo-100",
    orange: "bg-orange-100",
  };
  return colors[color] || "bg-gray-100";
};
