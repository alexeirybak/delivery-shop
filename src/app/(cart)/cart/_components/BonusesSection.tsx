import InStockToggle from "@/components/InStockToggle";
import { CONFIG } from "../../../../../config/config";
import { useCartStore } from "@/store/cartStore";

const BonusesSection = () => {
  const { pricing, isOrdered, useBonuses, setUseBonuses } = useCartStore();
  const { totalPrice, maxBonusUse } = pricing;

  if (maxBonusUse <= 0) return null;

  return (
    <div className="flex flex-col gap-y-5 text-base pb-6 border-b-2 border-[#f3f2f1]">
      <div className="flex flex-row items-center gap-x-2.5">
        <InStockToggle
          checked={useBonuses}
          onChangeAction={isOrdered ? () => {} : setUseBonuses}
        />
        <p>
          Списать{" "}
          {Math.min(
            maxBonusUse,
            Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100)
          )}{" "}
          ₽
        </p>
      </div>
      <div className="text-[#8f8f8f]">
        {`На карте накоплено ${maxBonusUse} ₽`}
      </div>
    </div>
  );
};

export default BonusesSection;
