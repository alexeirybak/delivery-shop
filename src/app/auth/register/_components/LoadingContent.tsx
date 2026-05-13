import { RotateCw } from "lucide-react";
import "../styles/loading.css";

export const LoadingContent = ({
  title,
}: {
  title: string | React.ReactNode;
}) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <RotateCw className="loading-icon" />
        <div className="loading-pulse" />
      </div>
      <div className="loading-text">
        <h3 className="loading-title">{title}</h3>
        <p className="loading-message">Пожалуйста, подождите...</p>
      </div>
    </div>
  );
};