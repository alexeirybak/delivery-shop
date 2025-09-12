import { tableStyles } from "../../styles";

const Register = ({ createdAt }: { createdAt: string }) => {
  return (
    <div
      className={`border-b border-gray-300 md:border-b-0 order-7 flex flex-row gap-y-1 md:flex-row gap-x-2 border-r md:border-r-0 ${tableStyles.colSpans.registration} ${tableStyles.border.bottom}`}
    >
      <div className="text-xs font-semibold md:hidden">Регистрация:</div>
      <div className="text-xs">
        {new Date(createdAt).toLocaleDateString("ru-RU")}
      </div>
      <div className="text-xs text-gray-400">
        {new Date(createdAt).toLocaleTimeString("ru-RU")}
      </div>
    </div>
  );
};

export default Register;
