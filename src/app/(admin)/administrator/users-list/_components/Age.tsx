import { tableStyles } from "../../styles";

interface AgeProps {
  birthdayDate: string;
}

const Age = ({ birthdayDate }: AgeProps) => {
  const calculateAge = (birthday: string) => {
    if (!birthday) return "-";

    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(birthdayDate);

  return (
    <div className={`text-xs border-b border-gray-300 md:border-b-0 order-3 ${tableStyles.colSpans.age} ${tableStyles.border.right}`}>
      {age === "-" ? "-" : (
        <>
          {age}
          <span className="md:hidden ml-1">лет</span>
        </>
      )}
    </div>
  );
};

export default Age;