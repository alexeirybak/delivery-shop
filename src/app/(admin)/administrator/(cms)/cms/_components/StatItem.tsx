import { StatItemProps } from "../types/dashboard";
import { getBgColor } from "../utils/getBgColor";
import { getTextColor } from "../utils/getTextColor";

export const StatItem = ({ stat, statValue }: StatItemProps) => {
  return (
    <div
      className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 ${getBgColor(stat.color)} rounded-lg`}>
          <div className={getTextColor(stat.color)}>{stat.icon}</div>
        </div>
        <span className={`text-2xl font-bold ${getTextColor(stat.color)}`}>
          {statValue}
        </span>
      </div>
      <h4 className="font-medium text-gray-900">{stat.title}</h4>
    </div>
  );
};
