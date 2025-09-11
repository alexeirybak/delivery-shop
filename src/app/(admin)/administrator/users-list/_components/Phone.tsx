import { maskedValue } from "../../../../../../utils/admin/maskPhone";
import { tableStyles } from "../../styles";

const Phone = ({
  phone,
  phoneVerified,
}: {
  phone: string;
  phoneVerified: boolean;
}) => {
  return (
    <div
      className={`border-b border-gray-300 md:border-b-0 order-5 flex flex-row gap-x-2 ${tableStyles.colSpans.phone} ${tableStyles.border.right}`}
    >
      <div className="text-xs font-semibold md:hidden">Телефон:</div>
      <div
        className={`text-xs ${
          phoneVerified ? "text-[#008c48]" : "text-[#d80000]"
        }`}
      >
        {maskedValue(phone)}
      </div>
    </div>
  );
};

export default Phone;
