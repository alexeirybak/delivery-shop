import { MenuOverlayProps } from "../../types/sidebar/sidebar.types";
import "../../../styles/menu-overlay.css";

export const MenuOverlay = ({ isOpen, onClose }: MenuOverlayProps) => {
  return (
    <div
      className={`menu-overlay ${isOpen ? "open" : "closed"}`}
      onClick={onClose}
    >
      {isOpen && (
        <>
          <div className="menu-overlay-blur-1" />
          <div className="menu-overlay-blur-2" />
        </>
      )}
    </div>
  );
};
