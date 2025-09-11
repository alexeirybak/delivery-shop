import { getShortDecimalId } from "../../../../../../utils/admin/shortDecimalId";
import { tableStyles } from "../../styles";

const UserId = ({ userId }: { userId: string }) => {
  return (
    <div
      className={`border-b border-gray-300 md:border-b-0 order-1 flex flex-row  gap-x-3 ${tableStyles.colSpans.id} ${tableStyles.border.right}`}
    >
      <div className="text-xs font-semibold md:hidden">ID:</div>
      <span className="font-mono text-xs flex lg:text-sm lg:bg-[#f3f2f1] justify-start md:justify-center rounded w-full">
        #{getShortDecimalId(userId)}
      </span>
    </div>
  );
};

export default UserId;
