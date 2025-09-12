import { calculateAge } from "../../../../../../utils/admin/calculateAge";
import { tableStyles } from "../../styles";

interface AgeProps {
  birthdayDate: string;
}

const Age = ({ birthdayDate }: AgeProps) => {
  const age = calculateAge(birthdayDate);

  return (
    <div
      className={`text-xs border-b border-gray-300 md:border-b-0 order-3 ${tableStyles.colSpans.age} ${tableStyles.border.right}`}
    >
      {age === 0 ? (
        0
      ) : (
        <>
          {age}
          <span className="md:hidden ml-1">лет</span>
        </>
      )}
    </div>
  );
};

export default Age;
