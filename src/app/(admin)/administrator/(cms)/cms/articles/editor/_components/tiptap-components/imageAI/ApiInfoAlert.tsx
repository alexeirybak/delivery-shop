import { ApiInfoAlertProps } from "../../../../types";

export const ApiInfoAlert = ({ apiInfo }: ApiInfoAlertProps) => {
  if (!apiInfo) return null;

  const getAlertStyles = () => {
    const apiInfoLower = apiInfo.toLowerCase();
    
    const isError =
      apiInfoLower.includes("ошибка") ||
      apiInfoLower.includes("error") ||
      apiInfoLower.includes("не удалось");

    const isSuccess =
      apiInfoLower.includes("работает") ||
      apiInfoLower.includes("запрос принят") ||
      apiInfoLower.includes("подключен");

    if (isError) {
      return "bg-red-50 border-red-200 text-red-800";
    } else if (isSuccess) {
      return "bg-green-50 border-green-200 text-green-800";
    } else {
      return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className={`mb-3 px-3 py-2 rounded-lg border ${getAlertStyles()}`}>
      <div className="text-sm whitespace-pre-line">{apiInfo}</div>
    </div>
  );
};