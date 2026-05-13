import { ApiInfoAlertProps } from "../../../types";
import "../../../styles/api-info-alert.css";

export const ApiInfoAlert = ({ apiInfo }: ApiInfoAlertProps) => {
  if (!apiInfo) return null;

  const getAlertType = () => {
    const apiInfoLower = apiInfo.toLowerCase();

    const isError =
      apiInfoLower.includes("ошибка") ||
      apiInfoLower.includes("error") ||
      apiInfoLower.includes("не удалось");

    const isSuccess =
      apiInfoLower.includes("работает") ||
      apiInfoLower.includes("запрос принят") ||
      apiInfoLower.includes("подключен");

    if (isError) return "error";
    if (isSuccess) return "success";
    return "info";
  };

  const alertType = getAlertType();

  return (
    <div className={`api-info-alert ${alertType}`}>
      <div className="api-info-alert-content">{apiInfo}</div>
    </div>
  );
};
