import { Zap, Library, TrendingUp } from "lucide-react";
import { DashboardTabsProps } from "../types";
import '../styles/dashboard-tabs.css'

export const DashboardTabs = ({
  activeTab,
  onTabChange,
}: DashboardTabsProps) => {
  const tabs = [
    { id: "generate", label: "Генерация", icon: Zap },
    { id: "library", label: "Библиотека", icon: Library },
    { id: "analytics", label: "Аналитика", icon: TrendingUp },
  ];

  return (
    <div className="dashboard-tabs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`dashboard-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
