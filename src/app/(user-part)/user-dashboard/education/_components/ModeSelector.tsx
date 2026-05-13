import { modes } from "../utils/modesEducation";
import { GenerationMode, ModeSelectorProps } from "../../types";
import "../../styles/mode-selector.css";

export const ModeSelector = ({
  currentMode,
  onModeChange,
}: ModeSelectorProps) => {
  return (
    <div className="mode-selector">
      {Object.entries(modes).map(([key, config]) => (
        <button
          key={key}
          onClick={() => onModeChange(key as GenerationMode)}
          className={`mode-btn ${currentMode === key ? "active" : ""}`}
          title={config.label}
        >
          {config.icon}
          <span>{config.label}</span>
        </button>
      ))}
    </div>
  );
};
