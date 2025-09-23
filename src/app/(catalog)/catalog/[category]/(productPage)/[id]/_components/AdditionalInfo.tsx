import { formatWeight } from "../../../../../../../../utils/formatWeight";

interface AdditionalInfoProps {
  brand: string;
  manufacturer: string;
  weight: number;
}

const AdditionalInfo = ({
  brand,
  manufacturer,
  weight,
}: AdditionalInfoProps) => {
  return (
    <div className="space-y-1 text-xs text-gray-600">
      <div className="flex justify-between bg-[#f3f2f1] py-1 px-2">
        <span className="font-medium">Бренд:</span>
        <span>{brand}</span>
      </div>
      <div className="flex justify-between py-1 px-2">
        <span className="font-medium">Страна производителя:</span>
        <span>{manufacturer}</span>
      </div>
      <div className="flex justify-between bg-[#f3f2f1] py-1 px-2">
        <span className="font-medium">Упаковка:</span>
        <span>{formatWeight(weight)}</span>
      </div>
    </div>
  );
};

export default AdditionalInfo;
