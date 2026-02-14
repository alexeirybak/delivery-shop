import { Wand2, Loader2 } from "lucide-react";
import { GenerateButtonProps } from "../types/auto-generate.types";

const GenerateButton = ({
  isGenerating,
  disabled,
  onClick,
}: GenerateButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full px-6 py-3 bg-linear-to-r from-orange-500 to-orange-600 text-white font-medium rounded hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed duration-300 cursor-pointer flex items-center justify-center"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin shrink-0" />
          Генерация и сохранение...
        </>
      ) : (
        <>
          <Wand2 className="w-5 h-5 mr-2 shrink-0" />
          Сгенерировать и сохранить статью
        </>
      )}
    </button>
  );
};

export default GenerateButton;
