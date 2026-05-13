import { Settings } from "lucide-react";
import "../styles/settings-panel.css";

interface SettingsButtonProps {
  onClick: (e: React.MouseEvent) => void;
  label: string;
  ariaLabel?: string;
  title?: string;
}

export const SettingsButton = ({ onClick, label, ariaLabel, title }: SettingsButtonProps) => {
  return (
    <button
      className="settings-trigger-btn"
      onClick={onClick}
      aria-label={ariaLabel || label}
      title={title || label}
    >
      <Settings size={18} />
      <span>{label}</span>
    </button>
  );
};