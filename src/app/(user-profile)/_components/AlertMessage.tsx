import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";

interface AlertMessageProps {
  type: "success" | "warning" | "error";
  message: ReactNode;
}

const AlertMessage = ({ type, message }: AlertMessageProps) => {
  const styles = {
    success: "bg-[#e5ffde] text-primary",
    warning: "bg-amber-50 text-amber-700",
    error: "bg-[#ffc7c7] text-[#d80000]",
  };

  return (
    <div className={`flex items-center px-3 py-2 rounded mt-3 ${styles[type]}`}>
      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default AlertMessage;
