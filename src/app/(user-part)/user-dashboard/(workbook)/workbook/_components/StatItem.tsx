import { StatItemProps } from "../types";
import "../../styles/stat-item.css";

export const StatItem = ({ stat, statValue }: StatItemProps) => {
  return (
    <div className="stat-item">
      <div className="stat-item-header">
        <div className="stat-item-icon">{stat.icon}</div>
        <span className="stat-item-value">{statValue}</span>
      </div>
      <h4 className="stat-item-title">{stat.title}</h4>
    </div>
  );
};
