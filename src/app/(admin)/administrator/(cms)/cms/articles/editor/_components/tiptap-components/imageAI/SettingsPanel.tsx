import { AspectRatio, SettingsPanelProps, StyleType } from "../../../../types";
import { aspectRatios } from "../../../../utils/aspectRatios";
import { promptStyles } from "../../../../utils/promptStyles";

export const SettingsPanel = ({
  selectedAspect,
  selectedStyle,
  onAspectChange,
  onStyleChange,
  disabled,
  onAspectButtonClick,
  onStyleButtonClick,
}: SettingsPanelProps) => {

  const handleAspectClick = (
    ratioId: AspectRatio,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onAspectChange(ratioId);
    if (onAspectButtonClick) {
      onAspectButtonClick(ratioId, e);
    }
  };

  const handleStyleClick = (
    styleId: StyleType,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    onStyleChange(styleId);
    if (onStyleButtonClick) {
      onStyleButtonClick(styleId, e);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Формат изображения:
        </label>
        <div className="grid grid-cols-5 gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.id}
              onClick={(e) => handleAspectClick(ratio.id, e)}
              disabled={disabled}
              className={`p-3 rounded-lg border flex flex-col items-center duration-300 cursor-pointer ${
                selectedAspect === ratio.id
                  ? "bg-red-50 border-red-300 text-red-700"
                  : "hover:bg-gray-50 border-gray-200 text-gray-700"
              }`}
              title={`${ratio.label} (${ratio.desc})`}
            >
              <span className="text-xl mb-1">{ratio.icon}</span>
              <span className="text-xs">{ratio.id}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Стиль изображения:
        </label>
        <div className="grid grid-cols-5 gap-2">
          {promptStyles.map((style) => (
            <button
              key={style.id}
              onClick={(e) => handleStyleClick(style.id, e)}
              disabled={disabled}
              className={`p-3 rounded-lg border flex flex-col items-center gap-1 duration-300 cursor-pointer ${
                selectedStyle === style.id
                  ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                  : "hover:bg-gray-50 border-gray-200 text-gray-700"
              }`}
              title={style.label}
            >
              <span className={style.color}>{style.icon}</span>
              <span className="text-xs">{style.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};