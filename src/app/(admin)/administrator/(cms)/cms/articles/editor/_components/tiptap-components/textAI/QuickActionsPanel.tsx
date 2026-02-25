import { Sparkles } from "lucide-react";
import { QuickActionsPanelProps } from "../../../../types";
import { quickActions } from "../../../../utils/quickActions";

export const QuickActionsPanel = ({
  onActionClick,
  isGenerating,
}: QuickActionsPanelProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        Быстрые действия:
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((action) => (
          <button
            type="button"
            key={action.id}
            onClick={() => onActionClick(action.id)}
            disabled={isGenerating}
            className={`flex items-center gap-1 md:gap-3 p-1 md:p-4 rounded-xl border transition-custom ${action.color} disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
            title={action.desc}
          >
            <div className="p-1 md:p-2 bg-white rounded-lg">{action.icon}</div>
            <div className="text-left">
              <div className="text-xs md:text-sm md:font-semibold text-gray-900">
                {action.label}
              </div>
              <div className="hidden md:block text-xs text-gray-600 mt-1">
                {action.desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
