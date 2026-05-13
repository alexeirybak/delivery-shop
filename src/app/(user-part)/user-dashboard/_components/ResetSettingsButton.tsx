import { RefreshCw } from "lucide-react";
import "../styles/settings-panel.css"

interface ResetSettingsButtonProps {
  onReset: () => void;
}

export const ResetSettingsButton = ({ 
  onReset, 
}: ResetSettingsButtonProps) => {
  return (
    <div className="settings-sidebar-footer">
      <button className="settings-reset-btn" onClick={onReset}>
        <RefreshCw size={14} />
        <span>Сбросить настройки</span>
      </button>
    </div>
  );
};