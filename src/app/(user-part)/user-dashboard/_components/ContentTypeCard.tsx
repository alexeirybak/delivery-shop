import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ContentTypeCardProps } from "../types";
import "../styles/content-type-card.css";

export const ContentTypeCard = ({
  id,
  title,
  description,
  color,
  gradient,
  icon: Icon,
  link,
  mode,
  isSelected,
  onSelect,
}: ContentTypeCardProps) => {
  const targetLink = mode === "workbook" ? link : `${link}?mode=${mode || id}`;

  return (
    <Link
      href={targetLink}
      className={`dashboard-card ${isSelected ? "selected" : ""}`}
      style={{ background: gradient }}
      onClick={() => onSelect?.(title)}
    >
      <div className="dashboard-card-icon" style={{ color }}>
        <Icon size={32} />
      </div>
      <h3 className="dashboard-card-title">{title}</h3>
      <p className="dashboard-card-description">{description}</p>
      <div className="dashboard-card-footer">
        <span className="dashboard-card-badge">На базе ИИ</span>
        <div className="dashboard-card-button">
          <span>Создать</span>
          <ChevronRight size={16} />
        </div>
      </div>
    </Link>
  );
};
