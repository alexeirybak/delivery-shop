import Image from "next/image";
import { getBonusesWord } from "../../../../../../../../utils/bonusWord";
const Bonuses = ({ bonus }: { bonus: number }) => {
  const roundedBonus = Math.round(bonus);
  const bonusWord = getBonusesWord(roundedBonus);

  return (
    <div className="w-[212px] flex flex-row gap-x-2 items-center justify-center mx-auto mb-2">
      <Image
        src="/icons-products/icon-green-smile.svg"
        alt="Бонусы"
        width={24}
        height={11}
      />
      <p className="text-xs text-primary">
        Вы получаете{" "}
        <span className="font-bold">
          {roundedBonus} {bonusWord}
        </span>
      </p>
    </div>
  );
};

export default Bonuses;
