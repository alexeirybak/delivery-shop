import { X, CheckCircle, AlertCircle } from "lucide-react";
import { NotificationProps } from "../categories/types";

export const Notification = ({ type, message, onClose }: NotificationProps) => {
  return (
    <div className={`fixed top-4 left-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${
      type === "success" 
        ? "bg-green-50 text-green-800 border border-green-200" 
        : "bg-red-50 text-red-800 border border-red-200"
    }`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {type === "success" ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
        
        <div className="flex-1">
          <p className="font-medium">
            {type === "success" ? "Успешно!" : "Ошибка"}
          </p>
          <p className="text-sm mt-1">{message}</p>
        </div>
        
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 cursor-pointer duration-300"
          aria-label="Закрыть уведомление"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};