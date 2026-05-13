import { Brain } from "lucide-react";
import '../styles/dashboard-header.css'

export const DashboardHeader = () => {
  return (
    <div className="dashboard-header">
      <div className="dashboard-header-content">
        <div className="dashboard-title-section">
          <div className="dashboard-icon-badge">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="dashboard-title">AI-конструктор образования</h1>
            <p className="dashboard-subtitle">
              Создавайте образовательные материалы нового поколения с помощью
              искусственного интеллекта
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};