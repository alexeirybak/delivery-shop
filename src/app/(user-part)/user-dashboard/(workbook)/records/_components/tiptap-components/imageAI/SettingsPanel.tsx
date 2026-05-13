import { AspectRatio, SettingsPanelProps, StyleType } from "../../../types";
import { aspectRatios } from "../../../utils/aspectRatios";
import { promptStyles } from "../../../utils/promptStyles";
import "../../../styles/settings-panel.css";

export const SettingsPanel = ({
  selectedAspect,
  selectedStyle,
  onAspectChange,
  onStyleChange,
  isGenerating,
  onAspectButtonClick,
  onStyleButtonClick,
}: SettingsPanelProps) => {
  const handleAspectClick = (ratioId: AspectRatio, e: React.MouseEvent) => {
    onAspectChange(ratioId);
    if (onAspectButtonClick) {
      onAspectButtonClick(ratioId, e);
    }
  };

  const handleStyleClick = (styleId: StyleType, e: React.MouseEvent) => {
    onStyleChange(styleId);
    if (onStyleButtonClick) {
      onStyleButtonClick(styleId, e);
    }
  };

  return (
    <div className="settings-panel">
      <div className="settings-group">
        <label className="settings-label">Формат изображения:</label>
        <div className="settings-buttons">
          {aspectRatios.map((ratio) => (
            <button
              type="button"
              key={ratio.id}
              onClick={(e) => handleAspectClick(ratio.id, e)}
              disabled={isGenerating}
              className={`settings-btn ${selectedAspect === ratio.id ? "active aspect" : ""}`}
              title={`${ratio.label} (${ratio.desc})`}
            >
              <span className="settings-btn-icon">{ratio.icon}</span>
              <span className="settings-btn-label">{ratio.id}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="settings-group">
        <label className="settings-label">Стиль изображения:</label>
        <div className="settings-buttons style">
          {promptStyles.map((style) => (
            <button
              type="button"
              key={style.id}
              onClick={(e) => handleStyleClick(style.id, e)}
              disabled={isGenerating}
              className={`settings-btn ${selectedStyle === style.id ? "active style" : ""}`}
              title={style.label}
            >
              <span className={style.color}>{style.icon}</span>
              <span className="settings-btn-label">{style.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
