import { X } from "lucide-react";
import { MenuHeaderProps } from "../../types/sidebar/sidebar.types";
import "../../../styles/menu-header.css";

export const MenuHeader = ({ onCloseAction, icon }: MenuHeaderProps) => {
  return (
    <div className="menu-header">
      <div className="menu-header-left">
        <div className="menu-header-icon-wrapper">
          <div className="menu-header-icon-glow" />
          <div className="menu-header-icon">{icon}</div>
        </div>
        <h2 className="menu-header-title">Быстрые действия</h2>
      </div>

      <button
        onClick={onCloseAction}
        className="menu-header-close"
        aria-label="Закрыть меню"
      >
        <X />
      </button>
    </div>
  );
};
