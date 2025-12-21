import { X } from "lucide-react";
import { NotificationProps } from "../../types/categories";

export const Notification = ({
  type,
  message,
  onClose,
  children,
}: NotificationProps) => {
  const baseClasses =
    "mb-4 p-4 rounded absolute top-10 flex justify-between items-center";
  const typeClasses =
    type === "success"
      ? "bg-green-50 text-green-800 border border-green-200"
      : "bg-red-50 text-red-800 border border-red-200";

  return (
    <div className={`${baseClasses} ${typeClasses}`}>
      <div className="flex items-center gap-2">
        {children}
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700 cursor-pointer duration-300"
        aria-label="Закрыть уведомление"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

