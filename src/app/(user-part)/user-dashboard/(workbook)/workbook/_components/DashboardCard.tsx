import { DashboardCardProps } from "../types";
import "../../styles/dashboard-card.css";

export const DashboardCard = ({ card, navigateTo }: DashboardCardProps) => {
  return (
    <div onClick={() => navigateTo(card.path)} className="workbook-dashboard-card">
      <div className="workbook-dashboard-card-content">
        <div className="workbook-dashboard-card-icon">{card.icon}</div>
        <h3 className="workbook-dashboard-card-title">{card.title}</h3>
        <p className="workbook-dashboard-card-description">{card.description}</p>
        <button className="workbook-dashboard-card-button">{card.actionText}</button>
      </div>
    </div>
  );
};
