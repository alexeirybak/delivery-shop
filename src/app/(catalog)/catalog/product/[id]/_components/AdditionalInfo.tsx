interface AdditionalInfoProps {
  brand: string;
  manufacturer: string;
  weight: number;
}

const AdditionalInfo = ({ brand, manufacturer, weight }: AdditionalInfoProps) => {
  // Функция для точного форматирования веса
  const formatWeight = (weight: number): string => {
    if (weight < 1) {
      // Меньше 1 кг - в граммах
      const grams = weight * 1000;
      // Убираем лишние нули после запятой
      const formattedGrams = grams % 1 === 0 ? grams.toString() : grams.toFixed(1).replace(/\.0$/, '');
      return `${formattedGrams} г`;
    } else {
      // 1 кг и больше
      const formattedKg = weight % 1 === 0 ? weight.toString() : weight.toFixed(2).replace(/\.00$/, '');
      return `${formattedKg} кг`;
    }
  };

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