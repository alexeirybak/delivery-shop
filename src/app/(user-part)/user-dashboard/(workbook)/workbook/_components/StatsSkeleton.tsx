import { stats } from "@/utils/stats";
import "../../styles/stats-skeleton.css";

export const StatsSkeleton = () => (
  <div className="stats-skeleton">
    <h2 className="stats-skeleton-title">
      Общая статистика
    </h2>
    <div className="stats-skeleton-grid">
      {stats.map((_, index) => (
        <div key={index} className="stats-skeleton-card">
          <div className="stats-skeleton-animate">
            <div className="stats-skeleton-line-large"></div>
            <div className="stats-skeleton-line-small"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);