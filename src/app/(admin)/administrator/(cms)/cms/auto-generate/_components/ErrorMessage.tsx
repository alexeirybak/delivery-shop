import { AlertCircle } from "lucide-react";

const ErrorMessage = ({ error }: { error: string }) => {
  return (
    <div className="rounded-xl p-4 bg-red-50 border border-red-200">
      <div className="flex">
        <div className="shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
