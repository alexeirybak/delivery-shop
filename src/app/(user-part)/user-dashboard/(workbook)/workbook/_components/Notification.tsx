import { X } from "lucide-react";
import "../../styles/notification.css";

interface NotificationProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

export const Notification = ({ type, message, onClose }: NotificationProps) => {
  const typeClass =
    type === "success"
      ? "workbook-notification-success"
      : "workbook-notification-error";

  return (
    <div className={`workbook-notification ${typeClass}`}>
      <div className="workbook-notification-content">
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="workbook-notification-close"
        aria-label="Закрыть уведомление"
      >
        <X />
      </button>
    </div>
  );
};
