import { MenuItemsListProps } from "../../types/sidebar/sidebar.types";
import { IconArrowAnim } from "./IconArrowAnim";
import "../../../styles/menu-items-list.css";

export const MenuItemsList = ({ items, onItemClick }: MenuItemsListProps) => {
  return (
    <div className="menu-items-list">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onItemClick(item.path)}
          className="menu-item"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="menu-item-icon-wrapper">
            <div className="menu-item-icon">{item.icon}</div>
          </div>

          <div className="menu-item-content">
            <div className="menu-item-title">{item.title}</div>
            <div className="menu-item-description">{item.description}</div>
          </div>

          <IconArrowAnim />
        </button>
      ))}
    </div>
  );
};
