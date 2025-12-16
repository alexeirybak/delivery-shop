import { DashboardCard as DashboardCardType } from "../types/dashboard";
import { getBgColor } from "../utils/getBgColor";
import { getButtonColor } from "../utils/getButtonColor";
import { getTextColor } from "../utils/getTextColor";

interface DashboardCardProps {
  card: DashboardCardType;
  navigateTo: (path: string) => void;
}

const DashboardCard = ({ card, navigateTo }: DashboardCardProps) => {
  return (
    <div
      onClick={() => navigateTo(card.path)}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 p-6 group"
    >
      <div className="flex flex-col h-full">
        <div
          className={`p-3 ${getBgColor(card.color)} rounded-lg w-fit mb-4 group-hover:scale-105 transition-transform duration-300`}
        >
          <div className={getTextColor(card.color)}>{card.icon}</div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {card.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 grow">{card.description}</p>
        <button
          className={`w-full py-2 ${getButtonColor(card.color)} text-white rounded-lg hover:opacity-90 transition-opacity duration-300 cursor-pointer mt-auto`}
        >
          {card.actionText}
        </button>
      </div>
    </div>
  );
};

export default DashboardCard;
