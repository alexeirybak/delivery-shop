import { Loader2 } from "lucide-react";

const SuccessMessage = ({success}: {success: string}) => {
  return (
    <div className="rounded-xl p-4 bg-green-50 border border-green-200">
      <div className="flex items-center">
        <Loader2 className="w-5 h-5 text-green-600 mr-2 animate-spin" />
        <div>
          <p className="text-sm font-medium text-green-800">{success}</p>
          <p className="text-xs text-green-600 mt-1">
            Через несколько секунд вы будете перенаправлены в редактор статьи
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessMessage;
