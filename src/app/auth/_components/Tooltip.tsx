import { AlertCircle } from "lucide-react";

interface TooltipProps {
  message: string;
  isVisible: boolean;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip = ({
  message,
  isVisible,
  position = "top",
}: TooltipProps) => {
  if (!isVisible) return null;

  return (
    <div
      className={`tooltip-container tooltip-${position} tooltip-visible`}
    >
      <div className="tooltip-content">
        <AlertCircle className="tooltip-icon" />
        <span>{message}</span>
      </div>
      <div className="tooltip-arrow" />
    </div>
  );
};